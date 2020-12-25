import {DualShockOptions} from "./dualshock-options";
import {Logger, LogLevel} from '@uspasojevic/logger';
import {Device, devices, HID} from "node-hid";
import {BehaviorSubject} from "rxjs";
import {DualShockState} from "./dualshock-state";
import {Coordinates} from "./coordinates";
import {AnalogState} from "./analog-state";
import {OrientationState} from "./orientation-state";
import {TouchPadState} from "./touch-pad-state";

export class DualShock {
    /**
     * Options for DualShock
     *
     * @internal
     */
    private _options: DualShockOptions;

    /**
     * Logger reference
     *
     * @internal
     */
    private _logger: Logger = new Logger();

    /**
     * Node HID reference
     *
     * @internal
     */
    private _hid: HID | null = null;

    /**
     * DualShock state
     */
    public readonly state: BehaviorSubject<Partial<DualShockState>> = new BehaviorSubject<Partial<DualShockState>>({});

    constructor(options?: DualShockOptions) {
        if (!options) {
            options = {};
        }

        options.vendorID = options.vendorID || 0x054c;
        options.productID = options.productID || 0x09cc;
        options.tag = options.tag || 'DualShock';

        this._options = options;
    }

    /**
     * Finds device based on vendor ID and product ID
     *
     * @param device - Reference of device that is currently being checked
     * @returns Returns true if vendor ID and product ID are matched
     * @internal
     */
    private _findDevice(device: Device): boolean {
        return device.vendorId === this._options.vendorID! && device.productId === this._options.productID;
    }

    /**
     * Checks if DPad Up is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getDPadUpState(state: number): boolean {
        return state === 0 || state === 1 || state === 7;
    }

    /**
     * Checks if DPad Down is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getDPadDownState(state: number): boolean {
        return state === 3 || state === 4 || state === 5;
    }

    /**
     * Checks if DPad Left is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getDPadLeftState(state: number): boolean {
        return state === 5 || state === 6 || state === 7;
    }

    /**
     * Checks if DPad Right is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getDPadRightState(state: number): boolean {
        return state === 1 || state === 2 || state === 3;
    }

    /**
     * Checks if Cross is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getCrossState(state: number): boolean {
        return (state & 32) !== 0;
    }

    /**
     * Checks if Circle is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getCircleState(state: number): boolean {
        return (state & 64) !== 0;
    }

    /**
     * Checks if Square is pressed
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed
     * @internal
     */
    private static _getSquareState(state: number): boolean {
        return (state & 16) !== 0;
    }

    /**
     * Returns Triangle button state
     *
     * @param state - Reference of state
     * @returns Retruns true if pressed, otherwise false
     * @internal
     */
    private static _getTriangleState(state: number): boolean {
        return (state & 128) !== 0;
    }

    /**
     * Returns Left stick movement state
     *
     * @param state - Reference of state
     * @returns Returns Left stick coordinates
     * @internal
     */
    private static _getLeftStickState(state: Buffer): Coordinates {
        return {
            x: state[1],
            y: state[2],
            z: 0
        };
    }

    /**
     * Returns Right stick movement state
     *
     * @param state - Reference of state
     * @returns Returns Right stick coordinates
     * @internal
     */
    private static _getRightStickState(state: Buffer): Coordinates {
        return {
            x: state[3],
            y: state[4],
            z: 0
        };
    }

    private static _getR3State(state: number): boolean {
        return (state & 128) !== 0;
    }

    private static _getL3State(state: number): boolean {
        return (state & 64) !== 0;
    }

    private static _getOptionsState(state: number): boolean {
        return (state & 32) !== 0;
    }

    private static _getShareState(state: number): boolean {
        return (state & 16) !== 0;
    }

    private static _getL1State(state: number): boolean {
        return (state & 1) !== 0;
    }

    private static _getR1State(state: number): boolean {
        return (state & 2) !== 0;
    }

    private static _getR2State(state: Buffer): AnalogState {
        return {
            pressed: (state[6] & 8) !== 0,
            value: state[9]
        };
    }

    private static _getL2State(state: Buffer): AnalogState {
        return {
            pressed: (state[6] & 4) !== 0,
            value: state[8]
        };
    }

    private static _getMotionState(state: Buffer): Coordinates {
        return {
            x: state.readInt16LE(13),
            y: -state.readInt16LE(15),
            z: -state.readInt16LE(17)
        };
    }

    private static _getOrientationState(state: Buffer): OrientationState {
        return {
            roll: -state.readInt16LE(19),
            yaw: state.readInt16LE(21),
            pitch: state.readInt16LE(23)
        };
    }

    private static _getTimestampState(state: number): number {
        return state >> 2;
    }

    private static _getTrackPadState(state: Buffer): TouchPadState {
        return {
            pressed: (state[7] & 2) !== 0,
            touches: [
                {
                    active: (state[35] >> 7) === 0,
                    coordinates: {
                        x: ((state[37] & 0x0f) << 8) | state[36],
                        y: state[38] << 4 | ((state[37] & 0xf0) >> 4),
                        z: 0
                    },
                    id: state[35] & 0x7f
                },
                {
                    active: (state[39] >> 7) === 0,
                    coordinates: {
                        x: ((state[41] & 0x0f) << 8) | state[40],
                        y: state[42] << 4 | ((state[41] & 0xf0) >> 4),
                        z: 0
                    },
                    id: state[39] & 0x7f
                }
            ]
        }
    }

    private static _getPsState(state: number): boolean {
        return (state & 1) !== 0;
    }

    private _parseHIDData(data: Buffer): void {
        let state: DualShockState = {
            leftStick: DualShock._getLeftStickState(data),
            rightStick: DualShock._getRightStickState(data),
            dPadUp: DualShock._getDPadUpState(data[5] & 15),
            dPadDown: DualShock._getDPadDownState(data[5] & 15),
            dPadLeft: DualShock._getDPadLeftState(data[5] & 15),
            dPadRight: DualShock._getDPadRightState(data[5] & 15),
            cross: DualShock._getCrossState(data[5]),
            circle: DualShock._getCircleState(data[5]),
            square: DualShock._getSquareState(data[5]),
            triangle: DualShock._getTriangleState(data[5]),
            r3: DualShock._getR3State(data[6]),
            l3: DualShock._getL3State(data[6]),
            options: DualShock._getOptionsState(data[6]),
            share: DualShock._getShareState(data[6]),
            l1: DualShock._getL1State(data[6]),
            r1: DualShock._getR1State(data[6]),
            l2: DualShock._getL2State(data),
            r2: DualShock._getR2State(data),
            motion: DualShock._getMotionState(data),
            orientation: DualShock._getOrientationState(data),
            timestamp: DualShock._getTimestampState(data[7]),
            battery: data[12],
            touchPad: DualShock._getTrackPadState(data),
            ps: DualShock._getPsState(data[7])
        };

        this.state.next(state);
    }

    private _handleHIDError(error: any): void {
        this._hid!.close();
        this._logger.log(
            LogLevel.ERROR,
            this._options.tag!,
            `Lost connection to ${this._options.vendorID}:${this._options.productID}`
        );
    }

    /**
     * Connects to the DualShock controller
     * Subscribe to `state` first
     */
    public connect(): void {
        this._logger.log(
            LogLevel.INFO,
            this._options.tag!,
            `Connecting to ${this._options.vendorID}:${this._options.productID}`
        );

        const device = devices().find(this._findDevice.bind(this));

        if (device) {
            this._hid = new HID(this._options.vendorID!, this._options.productID!);
            this._hid!.on('data', this._parseHIDData.bind(this));
            this._hid!.on('error', this._handleHIDError.bind(this));
        } else {
            this._logger.log(
                LogLevel.ERROR,
                this._options.tag!,
                `Failed to connect to ${this._options.vendorID!}:${this._options.productID!}`
            );
        }
    }
}