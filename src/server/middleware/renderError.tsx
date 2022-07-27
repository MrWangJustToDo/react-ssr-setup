import { renderToString } from 'react-dom/server';

import { HTML } from '@app/template';

import type { RenderErrorType } from '@app/types/server';

const renderError: RenderErrorType = ({ res, code, e }) =>
  res.send(
    '<!doctype html>' +
      renderToString(
        <HTML>
          <h1>server render error!</h1>
          <hr />
          <div style={{ fontSize: '18px', color: 'red' }}>
            error code:
            <b> {code}</b>
            <br />
            <br />
            <pre style={{ fontSize: '18px', color: 'red' }}>{e.stack}</pre>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `console.error("${e.stack || e.message}");`,
            }}
          />
        </HTML>,
      ),
  );

export { renderError };
