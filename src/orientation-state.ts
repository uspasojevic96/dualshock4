/**
 * Represents gyroscope sensor
 *
 * @author Uros Spasojevic
 */
export interface OrientationState {
    /**
     * Gyroscope pitch
     */
    pitch: number;

    /**
     * Gyroscope roll
     */
    roll: number;

    /**
     * Gyroscope yaw
     */
    yaw: number;
}