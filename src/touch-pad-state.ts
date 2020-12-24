import {TouchState} from "./touch-state";

export interface TouchPadState {
    touches: TouchState[];
    pressed: boolean;
}