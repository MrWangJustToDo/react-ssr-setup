import { GetInitialStateType } from "types/components";
import { delay } from "utils/delay";

export const getInitialState: GetInitialStateType = async () => delay(1000, () => ({ props: { a: 1, b: 2, c: 3, d: { a: 1, b: 2, c: 3 } } }));
