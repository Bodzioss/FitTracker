import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services & Models
import { WorkoutService } from '../../services/workout.service';
import { ExerciseService } from '../../../exercises/services/exercise.service';
import { Exercise } from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule,
    DragDropModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ (editId ? 'WORKOUTS.EDIT_TITLE' : 'WORKOUTS.CREATE_TITLE') | translate }}</h1>
      </div>

      <mat-card>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <!-- Template Name -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'WORKOUTS.NAME_LABEL' | translate }}</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Upper Body A">
            <mat-icon matSuffix>edit</mat-icon>
          </mat-form-field>

          <!-- Add Exercises Section -->
          <div class="exercises-section">
            <h3>{{ 'WORKOUTS.ADD_EXERCISE' | translate }}</h3>
            
            <div class="add-row">
              <mat-form-field appearance="outline" class="exercise-select">
                <mat-label>{{ 'WORKOUTS.ADD_EXERCISE' | translate }}</mat-label>
                <mat-select [formControl]="exerciseSelectControl">
                  <mat-option *ngFor="let ex of availableExercises" [value]="ex">
                    {{ ex.name }} ({{ ex.muscleGroup }})
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-mini-fab color="accent" type="button" (click)="addExercise()" [disabled]="!exerciseSelectControl.value">
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <!-- Selected Exercises List -->
            <div cdkDropList (cdkDropListDropped)="drop($event)" class="drag-list" *ngIf="selectedExercises.length > 0">
              <div *ngFor="let ex of selectedExercises; let i = index" class="exercise-item" cdkDrag>
                <mat-icon cdkDragHandle class="drag-handle">drag_indicator</mat-icon>
                <div class="drag-placeholder" *cdkDragPlaceholder></div>
                <span class="number">{{ i + 1 }}.</span>
                <span class="name">{{ ex.name }}</span>
                <span class="muscle">{{ ex.muscleGroup }}</span>
                <button mat-icon-button color="warn" (click)="removeExercise(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <p *ngIf="selectedExercises.length === 0" class="empty-hint">
              {{ 'WORKOUTS.NO_EXERCISES_HINT' | translate }}
            </p>
          </div>

          <div class="actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || selectedExercises.length === 0">
              {{ 'WORKOUTS.SAVE_TEMPLATE' | translate }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; h1 { margin: 0; color: #1976d2; } }
    mat-card { padding: 2rem; }
    .full-width { width: 100%; }
    .exercises-section { margin: 2rem 0; }
    .add-row { display: flex; gap: 1rem; align-items: center; .exercise-select { flex-grow: 1; } }
    .exercise-item { display: flex; align-items: center; padding: 0.8rem; border-bottom: 1px solid #eee; gap: 1rem; background: white;
      .number { font-weight: bold; color: #1976d2; }
      .name { flex-grow: 1; font-weight: 500; }
      .muscle { color: #888; font-size: 0.9rem; }
      .drag-handle { cursor: move; color: #ccc; }
    }
    .cdk-drag-preview { box-sizing: border-box; border-radius: 4px; box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12); }
    .cdk-drag-placeholder { opacity: 0; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .drag-list.cdk-drop-list-dragging .exercise-item:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .empty-hint { text-align: center; color: #999; margin: 2rem 0; font-style: italic; }
    .actions { display: flex; justify-content: flex-end; margin-top: 2rem; button { padding: 0.5rem 2rem; } }
  `]
})
export class CreateTemplateComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private workoutService = inject(WorkoutService);
  private exerciseService = inject(ExerciseService);
  private snackBar = inject(MatSnackBar);

  availableExercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  editId: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  exerciseSelectControl = this.fb.control<Exercise | null>(null);

  constructor() {
    this.exerciseService.getExercises().subscribe(data => {
      this.availableExercises = data;
      this.checkEditMode();
    });
  }

  ngOnInit() {
    // Moved logic to constructor/checkEditMode to wait for exercises
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.workoutService.getTemplates().subscribe(templates => {
        const template = templates.find(t => t.id === id);
        if (template) {
          this.form.patchValue({ name: template.name });
          // Map exercise IDs back to full Exercise objects
          this.selectedExercises = template.exerciseIds
            .map(eid => this.availableExercises.find(ex => ex.id === eid))
            .filter((ex): ex is Exercise => !!ex);
        }
      });
    }
  }

  addExercise() {
    const ex = this.exerciseSelectControl.value;
    if (ex) {
      this.selectedExercises.push(ex);
      this.exerciseSelectControl.reset();
    }
  }

  removeExercise(index: number) {
    this.selectedExercises.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedExercises, event.previousIndex, event.currentIndex);
  }

  goBack() {
    this.router.navigate(['/workouts']);
  }

  submit() {
    if (this.form.invalid || this.selectedExercises.length === 0) return;

    const template = {
      name: this.form.getRawValue().name,
      exerciseIds: this.selectedExercises.map(e => e.id!)
    };

    // Assuming we don't need userId in frontend request if backend handles it (or we hardcode it for MVP)
    // Actually Backend CreateWorkoutTemplateRequest expects (Name, ExerciseIds).
    // Let's match TS interface: frontend expects (Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>)

    // But wait, our TS interface in createTemplate param expects Omit<WorkoutTemplate...> which includes exerciseIds as string[].
    // Let's double check backend payload structure. It is { Name: string, ExerciseIds: string[] }.
    // So the payload is correct.

    const request = {
      name: template.name,
      exerciseIds: template.exerciseIds
    };

    if (this.editId) {
      this.workoutService.updateTemplate(this.editId, request).subscribe({
        next: () => {
          this.snackBar.open('Plan zaktualizowany!', 'OK', { duration: 3000 });
          this.router.navigate(['/workouts']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Błąd aktualizacji planu', 'OK', { duration: 3000 });
        }
      });
    } else {
      this.workoutService.createTemplate(request).subscribe({
        next: () => {
          this.snackBar.open('Plan utworzony!', 'OK', { duration: 3000 });
          this.router.navigate(['/workouts']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Błąd tworzenia planu', 'OK', { duration: 3000 });
        }
      });
    }
  }
}
