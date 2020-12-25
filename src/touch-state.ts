import {Coordinates} from "./coordinates";

export interface TouchState {
    active: boolean;
    coordinates: Coordinates;
    id: number;
}