import { CreateServerActionProps, CreateServerActionType, ServerActionType } from "types/share/store";

let serverAction: ServerActionType;
let getDataLoading_server: CreateServerActionType;
let getDataAction_Server: CreateServerActionType;
let getDataSucess_Server: CreateServerActionType;
let getDataFail_Server: CreateServerActionType;

serverAction = {
  GETDATALOADING: (name) => `getDataLoading_server_${name}`,
  GETDATAACTION: (name) => `getDataAction_server_${name}`,
  GETDATASUCESS: (name) => `getDataSucess_server_${name}`,
  GETDATAFAIL: (name) => `getDataFail_server_${name}`,
};

getDataLoading_server = ({ name }) => ({ type: serverAction.GETDATALOADING(name), loadingState: true });

getDataAction_Server = ({ name }) => ({ type: serverAction.GETDATALOADING(name), loadingState: true });

getDataSucess_Server = <T>({ name, data }: CreateServerActionProps<T>) => ({ type: serverAction.GETDATASUCESS(name), data, loadingState: false });

getDataFail_Server = <T>({ name, error }: CreateServerActionProps<T>) => ({ type: serverAction.GETDATAFAIL(name), error, loadingState: false });

export { serverAction, getDataLoading_server, getDataAction_Server, getDataSucess_Server, getDataFail_Server };
