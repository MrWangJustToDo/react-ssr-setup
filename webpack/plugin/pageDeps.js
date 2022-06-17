const { sources, Compilation } = require("webpack");

// https://github.com/artem-malko/react-ssr-template/blob/main/src/infrastructure/dependencyManager/webpack/plugin.ts

const RawSource = sources.RawSource;
const pluginName = "dependency-manager-plugin";

// https://github.com/shellscape/webpack-manifest-plugin/blob/6a521600b0b7dd66db805bf8fb8afaa8c41290cb/src/index.ts#L48
const hashKey = /([a-f0-9]{16,32}\.?)/gi;
const transformExtensions = /^(gz|map)$/i;

/**
 * Returns an info about deps for every page's chunk
 */
class PageDependenciesManagerPlugin {
  constructor(p = {}) {
    this.fileName = p.fileName || "manifest-deps.json";
  }
  apply(compiler) {
    // Capture the compilation and then set up further hooks.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Modern: `processAssets` is one of the last hooks before frozen assets.
      // I choose `PROCESS_ASSETS_STAGE_REPORT` which is the last possible
      // stage after which to emit.
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => this.emitStats(compilation)
      );
    });
  }

  emitStats(compilation) {
    // Get stats.
    const statsChunks = compilation.getStats().toJson().chunks;

    if (!statsChunks) {
      throw new Error("NO CHUNKS IN STATS");
    }

    return Promise.resolve()
      .then(() => {
        const reducedStats = statsChunks.reduce(
          (mutableAcc, statsChunk) => {
            if (!statsChunk.id) {
              return mutableAcc;
            }

            /**
             * It's possible, when chunk doesn't have its own name.
             * In that case its id will be used as a name
             */

            const files = Array.from(statsChunk.files || []).map((fileName) => {
              const replaced = fileName.replace(/\?.*/, "");
              const split = replaced.split(".");
              const extension = split.pop();
              const finalExtension = transformExtensions.test(extension) ? `${split.pop()}.${extension}` : extension;
              const name = statsChunk.names?.[0] ? statsChunk.names?.[0] + "." + finalExtension : fileName;
              // look like there have a difference for webpack-manifest-plugin
              return name.replace(hashKey, "");
            });

            mutableAcc.chunkIdToChunkName[statsChunk.id] = {
              id: statsChunk.id,
              name: files[0],
              locName: statsChunk.origins?.[0]?.request,
            };

            if (files[0]) {
              mutableAcc.chunkIdToFileNameMap[statsChunk.id] = files;
            }

            if (statsChunk.children) {
              mutableAcc.chunkIdToChildrenIds[statsChunk.id] = statsChunk.children.filter((childId) => {
                /**
                 * It's strange, but sometimes it is possible, that current chunk can have one dep
                 * in parents and in children.
                 * To prevent recursion in the next steps, we filter that ids out
                 */
                return !statsChunk.parents?.includes(childId);
              });
            }

            return mutableAcc;
          },
          {
            chunkIdToFileNameMap: {},
            chunkIdToChunkName: {},
            chunkIdToChildrenIds: {},
          }
        );

        return Object.keys(reducedStats.chunkIdToChunkName).reduce((mutableAcc, chunkId) => {
          const { name: chunkName, locName } = reducedStats.chunkIdToChunkName[chunkId];

          // We do not collect deps for not page's chunks
          if (!chunkName || !/page/i.test(chunkName)) {
            return mutableAcc;
          }

          const childrenIds = reducedStats.chunkIdToChildrenIds[chunkId];
          const files = getFiles(reducedStats.chunkIdToFileNameMap, reducedStats.chunkIdToChildrenIds, childrenIds);

          mutableAcc[locName] = [chunkName, ...files];

          return mutableAcc;
        }, {});
      })
      .then((result) => {
        const resultString = JSON.stringify(result, null, 2);
        const resultStringBuf = Buffer.from(resultString, "utf-8");
        const source = new RawSource(resultStringBuf);
        const filename = this.fileName;

        const asset = compilation.getAsset(filename);

        if (asset) {
          compilation.updateAsset(filename, source);
        } else {
          compilation.emitAsset(filename, source);
        }
      });
  }
}

/**
 * This function has a recurtion inside, cause the first level children can have its own children
 */
const getFiles = (chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds) => {
  const mutableFoundFiles = [];

  function innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds) {
    if (!childrenIds?.length) {
      return mutableFoundFiles;
    }

    childrenIds.forEach((childId) => {
      const fileName = chunkIdToFileNameMap[childId];

      if (chunkIdToChildrenIds[childId]?.length) {
        innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, chunkIdToChildrenIds[childId]);
      }
      if (fileName && !mutableFoundFiles.includes(fileName)) {
        mutableFoundFiles.push(...fileName);
      }
    });
  }

  innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds);

  return mutableFoundFiles;
};

module.exports.PageDependenciesManagerPlugin = PageDependenciesManagerPlugin;
