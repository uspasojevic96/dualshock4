/**
 * Represents actual state of DualShock4 controller
 *
 * @author Uros Spasojevic
 */
import {AnalogState} from "./analog-state";
import {Coordinates} from "./coordinates";
import {OrientationState} from "./orientation-state";
import {TouchPadState} from "./touch-pad-state";

export interface DualShockState {
    /**
     * Battery level
     */
    battery: number;

    /**
     * Circle button
     */
    circle: boolean;
    /**
     * Cross button
     */
    cross: boolean;

    /**
     * DPad Down button
     */
    dPadDown: boolean;

    /**
     * DPad Left button
     */
    dPadLeft: boolean;

    /**
     * DPad Right button
     */
    dPadRight: boolean;

    /**
     * DPad Up button
     */
    dPadUp: boolean;

    /**
     * L1 button
     */
    l1: boolean;

    /**
     * L2 analog button
     */
    l2: AnalogState;

    /**
     * L3 button
     */
    l3: boolean;

    /**
     * Left stick
     */
    leftStick: Coordinates;

    /**
     * Motion sensor
     */
    motion: Coordinates;

    /**
     * Options button
     */
    options: boolean;

    /**
     * Gyroscope sensor
     */
    orientation: OrientationState;

    /**
     * PS button
     */
    ps: boolean;

    /**
     * R1 button
     */
    r1: boolean;

    /**
     * R2 analog button
     */
    r2: AnalogState;

    /**
     * R3 button
     */
    r3: boolean;

    /**
     * Right stick
     */
    rightStick: Coordinates;

    /**
     * Share button
     */
    share: boolean;

    /**
     * Square button
     */
    square: boolean;

    /**
     * Internal timestamp
     */
    timestamp: number;

    /**
     * TouchPad
     */
    touchPad: TouchPadState;

    /**
     * Triangle button
     */
    triangle: boolean;
}