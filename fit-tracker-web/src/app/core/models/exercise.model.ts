export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    description?: string;
}

export interface CreateExerciseRequest {
    name: string;
    muscleGroup: string;
    description?: string;
}
