import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkoutService } from '../../services/workout.service';
import { Exercise } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../exercises/services/exercise.service';

@Component({
    selector: 'app-create-workout',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    templateUrl: './create-workout.component.html',
    styleUrls: ['./create-workout.component.scss']
})
export class CreateWorkoutComponent implements OnInit {
    private fb = inject(NonNullableFormBuilder);
    private workoutService = inject(WorkoutService);
    private exerciseService = inject(ExerciseService);

    exercisesList: Exercise[] = [];

    form = this.fb.group({
        date: [new Date(), Validators.required],
        notes: [''],
        exercises: this.fb.array([])
    });

    ngOnInit() {
        this.addExercise(); // Add initial exercise
        this.loadExercises();
    }

    loadExercises() {
        this.exerciseService.getExercises().subscribe(data => this.exercisesList = data);
    }

    get exercises() {
        return this.form.controls.exercises as FormArray;
    }

    getExerciseFormGroup(index: number): any {
        return this.exercises.at(index);
    }

    getSetsFormArray(exerciseIndex: number): FormArray {
        return this.getExerciseFormGroup(exerciseIndex).controls.sets as FormArray;
    }

    addExercise() {
        const exerciseGroup = this.fb.group({
            exerciseId: ['', Validators.required],
            // Name is stored for display snapshot, but selected via ID dropdown
            // We can resolve name on submit or listen to changes.
            // For MVP, just ID binding is key for dropdown.
            sets: this.fb.array([this.createSet()])
        });

        this.exercises.push(exerciseGroup);
    }

    createSet() {
        return this.fb.group({
            weight: [0, [Validators.required, Validators.min(0)]],
            reps: [0, [Validators.required, Validators.min(1)]],
            rpe: [0, [Validators.required, Validators.min(1), Validators.max(10)]]
        });
    }

    addSet(setsArray: FormArray) {
        setsArray.push(this.createSet());
    }

    removeExercise(index: number) {
        this.exercises.removeAt(index);
    }

    submit() {
        if (this.form.invalid) return;

        const formValue = this.form.getRawValue();

        // Enrich payload with Exercise Names (since dropdown only gives ID)
        const enrichedExercises = formValue.exercises.map((ex: any) => {
            const selectedExercise = this.exercisesList.find(e => e.id === ex.exerciseId);
            return {
                ...ex,
                name: selectedExercise ? selectedExercise.name : 'Unknown Exercise'
            };
        });

        const payload = {
            ...formValue,
            date: formValue.date.toISOString(), // Convert Date to ISO string expected by backend
            exercises: enrichedExercises
        };

        this.workoutService.createWorkout(payload as any).subscribe({
            next: (response) => {
                console.log('Workout created', response);
                alert('Workout logged successfully!');
                this.form.reset({ date: new Date() });
                this.exercises.clear();
                this.addExercise(); // Add an initial exercise after reset
            },
            error: (err) => {
                console.error(err);
                alert('Failed to create workout');
            }
        });
    }
}

