import type { HTMLProps } from ".";

export const Body = ({ children, script = [] }: HTMLProps) => (
  <body>
    <div id="__content__">{children}</div>
    {script.filter(Boolean).map((ele) => ele)}
    <script type="module" src="/@vite/client"></script>
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: `
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true    
    `,
      }}
    ></script>
    <script type="module" src="/src/client/entry.tsx"></script>
  </body>
);
