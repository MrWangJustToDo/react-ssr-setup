import type { GenerateActionProps } from './type';
import type { Configuration } from 'webpack';


export const statsConfig = ({
  env,
  isDEV,
}: GenerateActionProps): Configuration['stats'] => {
  return isDEV || env === 'server' ? 'errors-only' : 'normal';
};
