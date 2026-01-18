import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Exercise } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../services/exercise.service';

@Component({
    selector: 'app-manage-exercises',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule
    ],
    templateUrl: './manage-exercises.component.html',
    styleUrls: ['./manage-exercises.component.scss']
})
export class ManageExercisesComponent implements OnInit {
    private exerciseService = inject(ExerciseService);
    private breakpointObserver = inject(BreakpointObserver);
    private fb = inject(NonNullableFormBuilder);
    private cdr = inject(ChangeDetectorRef);

    exercises: Exercise[] = [];
    displayedColumns: string[] = ['name', 'muscleGroup', 'description', 'actions'];
    editingId: string | null = null;

    // RWD: Detect Handset (Mobile)
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    // Simple form for adding exercises
    form = this.fb.group({
        name: ['', Validators.required],
        muscleGroup: ['', Validators.required],
        description: ['']
    });

    isFormVisible = false;

    ngOnInit(): void {
        this.loadExercises();
    }

    loadExercises() {
        this.exerciseService.getExercises().subscribe({
            next: (data) => {
                this.exercises = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error(err)
        });
    }

    toggleForm() {
        this.isFormVisible = !this.isFormVisible;
        if (!this.isFormVisible) {
            this.cancelEdit();
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.form.reset();
        this.isFormVisible = false;
    }

    editExercise(exercise: Exercise) {
        this.editingId = exercise.id;
        this.form.patchValue({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description
        });
        this.isFormVisible = true;
    }

    deleteExercise(id: string) {
        if (!confirm('Are you sure you want to delete this exercise?')) return;

        this.exerciseService.deleteExercise(id).subscribe({
            next: () => {
                this.loadExercises();
                this.cdr.detectChanges();
            },
            error: (err) => console.error(err)
        });
    }

    submit() {
        if (this.form.invalid) return;

        const request = this.form.getRawValue();

        if (this.editingId) {
            this.exerciseService.updateExercise(this.editingId, request).subscribe({
                next: () => {
                    this.finishSubmit('Exercise updated!');
                },
                error: (err) => console.error(err)
            });
        } else {
            this.exerciseService.createExercise(request).subscribe({
                next: () => {
                    this.finishSubmit('Exercise created!');
                },
                error: (err) => console.error(err)
            });
        }
    }

    private finishSubmit(message: string) {
        this.loadExercises();
        this.cancelEdit(); // Resets form and hides it
        // Consider using SnackBar instead of alert in future
        // alert(message); 
    }
}
