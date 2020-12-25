import {TouchState} from "./touch-state";

export interface TouchPadState {
    pressed: boolean;
    touches: TouchState[];
}