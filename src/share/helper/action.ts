import { ActionHandlerType } from "types/share";

const actionHandler: ActionHandlerType = (state, action, otherAction) => {
  if (state) {
    return action(state);
  } else {
    if (otherAction && typeof otherAction === "function") {
      return otherAction();
    }
  }
};

export { actionHandler };
