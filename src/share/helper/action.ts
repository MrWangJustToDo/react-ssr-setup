import { ActionHandlerType } from "types/share";

let actionHandler: ActionHandlerType;

actionHandler = (state, action, otherAction) => {
  if (state) {
    return action(state);
  } else {
    if (otherAction && typeof otherAction === 'function') {
      return otherAction();
    }
  }
};

export { actionHandler };
