export interface GenerateActionProps {
  env: 'client' | 'server';
  isDEV?: boolean;
  isSSR?: boolean;
  isCSR?: boolean;
  isMIDDLEWARE?: boolean;
  isANIMATE_ROUTER?: boolean;
}
