import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { WorkoutService } from '../../services/workout.service';
import { ExerciseService } from '../../../exercises/services/exercise.service';
import { WorkoutSession } from '../../../../core/models/workout.model';
import { Exercise } from '../../../../core/models/exercise.model';

@Component({
    selector: 'app-workout-history',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatChipsModule
    ],
    template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ 'WORKOUTS.HISTORY_TITLE' | translate }}</h1>
      </div>

      <div class="loading-shade" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div class="history-list" *ngIf="!loading">
        <div *ngIf="sessions.length === 0" class="empty-state">
            <mat-icon>history</mat-icon>
            <p>{{ 'WORKOUTS.NO_HISTORY' | translate }}</p>
        </div>

        <mat-accordion multi>
          <mat-expansion-panel *ngFor="let session of sessions" class="session-card">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="date-badge">
                    <span class="day">{{ session.date | date:'dd' }}</span>
                    <span class="month">{{ session.date | date:'MMM' }}</span>
                </div>
                <div class="session-info">
                    <span class="workout-name">{{ getTemplateName(session.templateId) || ('WORKOUTS.UNKNOWN_TEMPLATE' | translate) }}</span>
                    <span class="exercise-count">{{ session.exercises.length }} {{ 'WORKOUTS.EXERCISES' | translate }}</span>
                </div>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="session-details">
                <div *ngFor="let exLog of session.exercises" class="exercise-log">
                    <h4>{{ getExerciseName(exLog.exerciseId) }}</h4>
                    <div class="sets-display">
                        <mat-chip-set>
                            <mat-chip *ngFor="let set of exLog.sets">
                                {{ set.weight }}kg x {{ set.reps }}
                            </mat-chip>
                        </mat-chip-set>
                    </div>
                </div>
            </div>

          </mat-expansion-panel>
        </mat-accordion>
      </div>
    </div>
  `,
    styles: [`
    .container { padding: 2rem; max-width: 800px; margin: 0 auto; padding-bottom: 80px; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; h1 { margin: 0; color: #1976d2; } }
    .loading-shade { display: flex; justify-content: center; padding: 2rem; }
    
    .empty-state { text-align: center; color: #888; margin-top: 3rem; 
        mat-icon { font-size: 4rem; width: 4rem; height: 4rem; margin-bottom: 1rem; }
    }

    .session-card { margin-bottom: 1rem; }
    
    mat-panel-title { align-items: center; gap: 1rem; }
    
    .date-badge { 
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: #e3f2fd; color: #1565c0; border-radius: 8px; padding: 4px 8px; min-width: 50px;
        .day { font-size: 1.2rem; font-weight: bold; line-height: 1; }
        .month { font-size: 0.8rem; text-transform: uppercase; }
    }

    .session-info { display: flex; flex-direction: column; 
        .workout-name { font-weight: 500; font-size: 1.1rem; }
        .exercise-count { font-size: 0.8rem; color: #666; }
    }

    .exercise-log { margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; &:last-child { border-bottom: none; } }
    h4 { margin: 0 0 0.5rem 0; color: #444; }
  `]
})
export class WorkoutHistoryComponent implements OnInit {
    private workoutService = inject(WorkoutService);
    private exerciseService = inject(ExerciseService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    sessions: WorkoutSession[] = [];
    exercisesMap: Map<string, string> = new Map(); // ID -> Name
    loading = true;

    ngOnInit() {
        // 1. Load Exercises first (to map IDs to Names)
        this.exerciseService.getExercises().subscribe(exercises => {
            exercises.forEach(e => this.exercisesMap.set(e.id!, e.name));

            // 2. Then Load Sessions
            this.loadSessions();
        });
    }

    loadSessions() {
        this.workoutService.getSessions().subscribe({
            next: (data) => {
                this.sessions = data;
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    getExerciseName(id: string): string {
        return this.exercisesMap.get(id) || 'Unknown Exercise';
    }

    // TODO: Fetch templates to map names properly. For now simple logic.
    getTemplateName(id: string): string {
        return id ? 'Workout Session' : 'Free Workout';
    }

    goBack() {
        this.router.navigate(['/']);
    }
}
