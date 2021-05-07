import { CreateServerActionProps, CreateServerActionType, ServerActionType } from "types/share/store";

const serverAction: ServerActionType = {
  GETDATALOADING: (name) => `getDataLoading_server_${name}`,
  GETDATAACTION: (name) => `getDataAction_server_${name}`,
  GETDATASUCESS: (name) => `getDataSucess_server_${name}`,
  GETDATAFAIL: (name) => `getDataFail_server_${name}`,
};

const getDataLoading_server: CreateServerActionType = ({ name }) => ({ type: serverAction.GETDATALOADING(name), loadingState: true });

const getDataAction_Server: CreateServerActionType = ({ name }) => ({ type: serverAction.GETDATAACTION(name), loadingState: true });

const getDataSucess_Server: CreateServerActionType = <T>({ name, data }: CreateServerActionProps<T>) => ({
  type: serverAction.GETDATASUCESS(name),
  data,
  loadingState: false,
});

const getDataFail_Server: CreateServerActionType = <T>({ name, error }: CreateServerActionProps<T>) => ({
  type: serverAction.GETDATAFAIL(name),
  error,
  loadingState: false,
});

export { serverAction, getDataLoading_server, getDataAction_Server, getDataSucess_Server, getDataFail_Server };
