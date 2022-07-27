import { commonConfig } from './config/comm';
import { resolveConfig } from './config/resolve';
import { statsConfig } from './config/statsConfig';

import type { GenerateActionProps } from './config/type';

export const BaseConfig = ({ env, isDEV }: GenerateActionProps) => ({
  ...commonConfig({ env }),
  resolve: resolveConfig(),
  stats: statsConfig({ env, isDEV }),
  infrastructureLogging: {
    level: 'error' as const,
  },
});
