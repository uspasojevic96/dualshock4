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
    private options: DualShockOptions;
    private logger: Logger = new Logger();
    private hid: HID | null = null;

    public readonly state: BehaviorSubject<Partial<DualShockState>> = new BehaviorSubject<Partial<DualShockState>>({});

    constructor(options: DualShockOptions) {
        options.vendorID = options.vendorID || 0x054c;
        options.productID = options.productID || 0x09cc;
        options.tag = options.tag || 'DualShock';

        this.options = options;
    }

    private _findDevice(device: Device): boolean {
        return device.vendorId === this.options.vendorID! && device.productId === this.options.productID;
    }

    private static _getDPadUpState(dpad: number): boolean {
        return dpad === 0 || dpad === 1 || dpad === 7;
    }

    private static _getDPadDownState(dpad: number): boolean {
        return dpad === 3 || dpad === 4 || dpad === 5;
    }

    private static _getDPadLeftState(dpad: number): boolean {
        return dpad === 5 || dpad === 6 || dpad === 7;
    }

    private static _getDPadRightState(dpad: number): boolean {
        return dpad === 1 || dpad === 2 || dpad === 3;
    }

    private static _getCrossState(state: number): boolean {
        return (state & 32) !== 0;
    }

    private static _getCircleState(state: number): boolean {
        return (state & 64) !== 0;
    }

    private static _getSquareState(state: number): boolean {
        return (state & 16) !== 0;
    }

    private static _getTriangleState(state: number): boolean {
        return (state & 128) !== 0;
    }

    private static _getLeftStickState(state: Buffer): Coordinates {
        return {
            x: state[1],
            y: state[2],
            z: 0
        };
    }

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
        this.hid!.close();
        this.logger.log(
            LogLevel.ERROR,
            this.options.tag!,
            `Lost connection to ${this.options.vendorID}:${this.options.productID}`
        );
    }

    public connect(): void {
        this.logger.log(
            LogLevel.INFO,
            this.options.tag!,
            `Connecting to ${this.options.vendorID}:${this.options.productID}`
        );

        const device = devices().find(this._findDevice.bind(this));

        if (device) {
            this.hid = new HID(this.options.vendorID!, this.options.productID!);
            this.hid!.on('data', this._parseHIDData.bind(this));
            this.hid!.on('error', this._handleHIDError.bind(this));
        } else {
            this.logger.log(
                LogLevel.ERROR,
                this.options.tag!,
                `Failed to connect to ${this.options.vendorID!}:${this.options.productID!}`
            );
        }
    }
}