import { ClientActionType, CreateClientActionProps, CreateClientActionType } from "types/share/store";

let clientAction: ClientActionType;
let setDataLoading_client: CreateClientActionType;
let setDataAction_client: CreateClientActionType;
let setDataSucess_client: CreateClientActionType;
let setDataFail_client: CreateClientActionType;

clientAction = {
  SETDATALOADING: (name) => `setDataLoading_client_${name}`,
  SETDATAACTION: (name) => `setDataAction_client_${name}`,
  SETDATASUCESS: (name) => `setDataSucess_client_${name}`,
  SETDATAFAIL: (name) => `setDataFail_client_${name}`,
};

setDataLoading_client = ({ name }) => ({ type: clientAction.SETDATALOADING(name), loadingState: true });

setDataAction_client = ({ name }) => ({ type: clientAction.SETDATAACTION(name), loadingState: true });

setDataSucess_client = <T>({ name, data }: CreateClientActionProps<T>) => ({ type: clientAction.SETDATASUCESS(name), data, loadingState: false });

setDataFail_client = <T>({ name, error }: CreateClientActionProps<T>) => ({ type: clientAction.SETDATAFAIL(name), error, loadingState: false });

export { clientAction, setDataLoading_client, setDataAction_client, setDataSucess_client, setDataFail_client };
