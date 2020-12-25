/**
 * Represents touchpad state
 *
 * @author Uros Spasojevic
 */
import {TouchState} from "./touch-state";

export interface TouchPadState {
    /**
     * Indicator flag whether touchpad is pressed or not
     */
    pressed: boolean;

    /**
     * Array of touches, it's two touch sensor
     */
    touches: TouchState[];
}