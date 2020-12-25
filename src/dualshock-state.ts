import {AnalogState} from "./analog-state";
import {Coordinates} from "./coordinates";
import {OrientationState} from "./orientation-state";
import {TouchPadState} from "./touch-pad-state";

export interface DualShockState {
    battery: number;
    circle: boolean;
    cross: boolean;
    dPadDown: boolean;
    dPadLeft: boolean;
    dPadRight: boolean;
    dPadUp: boolean;
    l1: boolean;
    l2: AnalogState;
    l3: boolean;
    leftStick: Coordinates;
    motion: Coordinates;
    options: boolean;
    orientation: OrientationState;
    ps: boolean;
    r1: boolean;
    r2: AnalogState;
    r3: boolean;
    rightStick: Coordinates;
    share: boolean;
    square: boolean;
    timestamp: number;
    touchPad: TouchPadState;
    triangle: boolean;
}