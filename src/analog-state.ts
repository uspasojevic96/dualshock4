/**
 * Represents the state of analog buttons (L2, R2)
 *
 * @author Uros Spasojevic
 */
export interface AnalogState {
    /**
     * Indicator flag whether button is pressed or not
     */
    pressed: boolean;

    /**
     * Represents the actuation of actual analog button when pressed
     */
    value: number;
}