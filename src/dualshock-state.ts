import {Coordinates} from "./coordinates";
import {AnalogState} from "./analog-state";
import {TouchPadState} from "./touch-pad-state";
import {OrientationState} from "./orientation-state";

export interface DualShockState {
    leftStick: Coordinates;
    rightStick: Coordinates;
    cross: boolean;
    circle: boolean;
    triangle: boolean;
    square: boolean;
    dPadLeft: boolean;
    dPadRight: boolean;
    dPadUp: boolean;
    dPadDown: boolean;
    l1: boolean;
    l2: AnalogState;
    l3: boolean;
    r1: boolean;
    r2: AnalogState;
    r3: boolean;
    share: boolean;
    options: boolean;
    touchPad: TouchPadState;
    motion: Coordinates;
    orientation: OrientationState;
    battery: number;
    timestamp: number;
    ps: boolean;
}