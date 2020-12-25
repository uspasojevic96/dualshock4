/**
 * Represents touchpad touch state
 *
 * @author Uros Spasojevic
 */
import {Coordinates} from "./coordinates";

export interface TouchState {
    /**
     * Indicator flag whether a touch is active
     */
    active: boolean;

    /**
     * Coordinates of the touch
     */
    coordinates: Coordinates;

    /**
     * Touch indentifier
     */
    id: number;
}