import { injectApp as injectDevApp } from './start-dev';
import { injectApp as injectProdApp } from './start-prod';

export const injectApp =
  process.env.NODE_ENV === 'production' ? injectProdApp : injectDevApp;
