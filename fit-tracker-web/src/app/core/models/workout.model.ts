export interface WorkoutRequest {
    date: string;
    notes?: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
    exerciseId: string;
    name: string;
    sets: WorkoutSet[];
}

export interface WorkoutSet {
    weight: number;
    reps: number;
    rpe: number;
}
