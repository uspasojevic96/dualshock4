import {Coordinates} from "./coordinates";

export interface TouchState {
    coordinates: Coordinates;
    id: number;
    active: boolean;
}