export interface Measurement {
    id: string;
    userId: string;
    date: Date;
    weight: number;
    height: number;
    chest: number;
    waist: number;
    hips: number;
    bicep: number;
    thigh: number;
    calf: number;
}

export interface LogMeasurementRequest {
    weight: number;
    height: number;
    chest: number;
    waist: number;
    hips: number;
    bicep: number;
    thigh: number;
    calf: number;
    date?: Date;
}
