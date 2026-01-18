export interface WorkoutTemplate {
    id?: string;
    userId: string;
    name: string;
    exerciseIds: string[];
    createdAt?: Date;
}

export interface WorkoutSession {
    id?: string;
    userId: string;
    templateId?: string;
    date: Date;
    exercises: ExerciseLog[];
}

export interface ExerciseLog {
    exerciseId: string;
    sets: SetLog[];
}

export interface SetLog {
    reps: number;
    weight: number;
}
