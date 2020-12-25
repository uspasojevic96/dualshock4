/**
 * Represents coordinates which are used for sticks, motion and touchpad touch detection,
 * Z coordinate is set to 0 for sticks and touchpad touch
 *
 * @author Uros Spasojevic
 */
export interface Coordinates {
    /**
     * X coordinate
     */
    x: number;

    /**
     * Y coordinate
     */
    y: number;

    /**
     * Z coordinate
     */
    z: number;
}