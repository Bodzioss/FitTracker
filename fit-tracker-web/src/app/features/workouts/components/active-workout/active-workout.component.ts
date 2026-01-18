import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { WorkoutService } from '../../services/workout.service';
import { WorkoutTemplate } from '../../../../core/models/workout.model';
import { ExerciseService } from '../../../exercises/services/exercise.service';
import { Exercise } from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-active-workout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header" *ngIf="template">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ template.name }}</h1>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <form [formGroup]="form" (ngSubmit)="finishWorkout()" *ngIf="!loading && template">
        
        <div formArrayName="exercises">
          <mat-accordion multi>
            <mat-expansion-panel *ngFor="let exControl of exercisesControls; let i = index" [formGroupName]="i" [expanded]="true">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <strong>{{ getExerciseName(exControl.value.exerciseId) }}</strong>
                </mat-panel-title>
                <mat-panel-description>
                  {{ exControl.value.sets.length }} {{ 'WORKOUTS.SETS' | translate }}
                </mat-panel-description>
              </mat-expansion-panel-header>

              <!-- Sets List -->
              <div formArrayName="sets">
                <div *ngFor="let setControl of getSetsControls(i); let j = index" [formGroupName]="j" class="set-row">
                  <div class="set-number">{{ j + 1 }}</div>
                  
                  <mat-form-field appearance="outline" class="small-input">
                    <mat-label>{{ 'WORKOUTS.WEIGHT' | translate }}</mat-label>
                    <input matInput type="number" formControlName="weight">
                    <span matTextSuffix>kg</span>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="small-input">
                    <mat-label>{{ 'WORKOUTS.REPS' | translate }}</mat-label>
                    <input matInput type="number" formControlName="reps">
                  </mat-form-field>

                  <button mat-icon-button color="warn" type="button" (click)="removeSet(i, j)" [disabled]="getSetsControls(i).length <= 1">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="panel-actions">
                <button mat-stroked-button color="primary" type="button" (click)="addSet(i)">
                  <mat-icon>add</mat-icon> {{ 'WORKOUTS.ADD_SET' | translate }}
                </button>
              </div>

            </mat-expansion-panel>
          </mat-accordion>
        </div>

        <div class="footer-actions">
          <button mat-raised-button color="warn" type="button" (click)="goBack()">{{ 'WORKOUTS.CANCEL' | translate }}</button>
          <button mat-raised-button color="primary" type="submit" class="finish-btn">
            <mat-icon>check</mat-icon> {{ 'WORKOUTS.FINISH' | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; max-width: 800px; margin: 0 auto; padding-bottom: 80px; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; h1 { margin: 0; color: #1976d2; } }
    .set-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .set-number { font-weight: bold; width: 24px; text-align: center; color: #666; }
    .small-input { width: 100px; }
    .panel-actions { margin-top: 1rem; text-align: right; }
    .footer-actions { 
      position: fixed; bottom: 0; left: 0; right: 0; 
      background: white; padding: 1rem; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      display: flex; justify-content: space-between; gap: 1rem; z-index: 10;
      max-width: 800px; margin: 0 auto;
    }
    .finish-btn { flex-grow: 1; padding: 1.5rem !important; font-size: 1.2rem; }
    @media (min-width: 800px) { .footer-actions { position: static; box-shadow: none; margin-top: 2rem; background: transparent; } }
  `]
})
export class ActiveWorkoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private workoutService = inject(WorkoutService);
  private exerciseService = inject(ExerciseService);
  private snackBar = inject(MatSnackBar);
  public translate = inject(TranslateService);

  templateId: string | null = null;
  template: WorkoutTemplate | null = null;
  allExercises: Exercise[] = [];
  loading = true;

  form = this.fb.group({
    exercises: this.fb.array([])
  });

  get exercisesControls() {
    return (this.form.get('exercises') as FormArray).controls;
  }

  getSetsControls(exerciseIndex: number) {
    return (this.exercisesControls[exerciseIndex].get('sets') as FormArray).controls;
  }

  ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('templateId');

    // Load exercises library first (needed for names)
    this.exerciseService.getExercises().subscribe(exercises => {
      this.allExercises = exercises;

      if (this.templateId) {
        this.loadTemplate(this.templateId);
      }
    });
  }

  loadTemplate(id: string) {
    // Ideally we have getTemplateById, but for now we filter all templates
    // If backend doesn't support getById yet, we might need to add it or fetch all.
    // Assuming we fetch all effectively for now as MVP.
    this.workoutService.getTemplates().subscribe(templates => {
      this.template = templates.find(t => t.id === id) || null;
      if (this.template) {
        this.initForm(this.template);
      } else {
        this.snackBar.open('Template not found', 'Error', { duration: 3000 });
        this.goBack();
      }
      this.loading = false;
    });
  }

  initForm(template: WorkoutTemplate) {
    const exercisesArray = this.form.get('exercises') as FormArray;
    exercisesArray.clear();

    template.exerciseIds.forEach(exId => {
      exercisesArray.push(this.fb.group({
        exerciseId: [exId],
        sets: this.fb.array([
          this.createSetGroup() // Start with 1 set
        ])
      }));
    });
  }

  createSetGroup() {
    return this.fb.group({
      reps: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addSet(exerciseIndex: number) {
    const sets = this.exercisesControls[exerciseIndex].get('sets') as FormArray;
    // Copy values from previous set for convenience
    const lastSet = sets.at(sets.length - 1).value;
    const newSet = this.createSetGroup();
    newSet.patchValue({
      reps: lastSet.reps,
      weight: lastSet.weight
    });
    sets.push(newSet);
  }

  removeSet(exerciseIndex: number, setIndex: number) {
    const sets = this.exercisesControls[exerciseIndex].get('sets') as FormArray;
    if (sets.length > 1) {
      sets.removeAt(setIndex);
    }
  }

  getExerciseName(id: string): string {
    return this.allExercises.find(e => e.id === id)?.name || 'Unknown Exercise';
  }

  goBack() {
    this.router.navigate(['/workouts']);
  }

  finishWorkout() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const sessionPayload = {
      templateId: this.templateId!,
      date: new Date(),
      exercises: formValue.exercises.map((ex: any) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map((s: any) => ({
          reps: s.reps,
          weight: s.weight
        }))
      }))
    };

    this.workoutService.logSession(sessionPayload).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('WORKOUTS.SESSION_SAVED'), 'OK', { duration: 3000 });
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error saving workout', 'OK', { duration: 3000 });
      }
    });
  }
}
