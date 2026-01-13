import { Component, OnInit, inject } from '@angular/core';
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

    exercises: Exercise[] = [];
    displayedColumns: string[] = ['name', 'muscleGroup', 'description'];

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
            },
            error: (err) => console.error(err)
        });
    }

    toggleForm() {
        this.isFormVisible = !this.isFormVisible;
    }

    submit() {
        if (this.form.invalid) return;

        this.exerciseService.createExercise(this.form.getRawValue()).subscribe({
            next: () => {
                this.loadExercises();
                this.form.reset();
                this.isFormVisible = false;
                alert('Exercise added!');
            },
            error: (err) => console.error(err)
        });
    }
}
