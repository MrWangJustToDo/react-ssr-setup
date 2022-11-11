import { Children, cloneElement } from "react";

export const ViteInject = () => {
  const elements = [];
  if (__DEVELOPMENT__) {
    elements.push(
      <script type="module" src="/@vite/client" />,
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
      />
    );
  }

  elements.push(<script type="module" src="/src/client/entry.tsx" />);

  return Children.map(elements, (child, index) => cloneElement(child, { key: index }));
};
