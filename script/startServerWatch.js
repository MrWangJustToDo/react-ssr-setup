const startServerWatch = (serverCompiler) => {
  serverCompiler.watch(
    {
      aggregateTimeout: 800, // 聚合多个修改一起构建
      ignored: ["**/node_modules", "**/router/dynamicRoutes.ts"], // 排除文件
      poll: 2000, // 轮询检测变更
      "info-verbosity": "verbose", //在增量构建的开始和结束时，向控制台发送消息
    },
    (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    }
  );
};

exports.startServerWatch = startServerWatch;
