import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutTemplate } from '../../../../core/models/workout.model';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-workout-templates',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ 'WORKOUTS.TEMPLATES_TITLE' | translate }}</h1>
      </div>

      <div class="loading-shade" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div class="templates-grid" *ngIf="!loading">
        <!-- New Template Card (always visible) -->
        <mat-card class="create-card" (click)="createTemplate()">
          <mat-card-content>
            <mat-icon>add_circle_outline</mat-icon>
            <h3>{{ 'WORKOUTS.CREATE_NEW' | translate }}</h3>
          </mat-card-content>
        </mat-card>

        <!-- Existing Templates -->
        <mat-card *ngFor="let template of templates" class="template-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>fitness_center</mat-icon>
            <mat-card-title>{{ template.name }}</mat-card-title>
            <mat-card-subtitle>{{ template.exerciseIds.length }} {{ 'WORKOUTS.EXERCISES' | translate }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions align="end">
            <button mat-button color="primary" (click)="startWorkout(template.id!)">{{ 'WORKOUTS.START' | translate }}</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; h1 { margin: 0; color: #1976d2; } }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .create-card { 
      display: flex; justify-content: center; align-items: center; cursor: pointer; border: 2px dashed #ccc; background: #fafafa; min-height: 160px;
      &:hover { background: #f0f0f0; border-color: #1976d2; }
      mat-card-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
      mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: #666; }
      h3 { margin: 0; color: #666; }
    }
    .template-card { min-height: 160px; }
    .loading-shade { display: flex; justify-content: center; padding: 2rem; }
  `]
})
export class WorkoutTemplatesComponent implements OnInit {
  private service = inject(WorkoutService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  templates: WorkoutTemplate[] = [];
  loading = true;

  ngOnInit() {
    console.log('WorkoutTemplatesComponent: OnInit started');
    this.service.getTemplates().subscribe({
      next: (data) => {
        console.log('WorkoutTemplatesComponent: Data received', data);
        this.templates = data;
        this.loading = false;
        this.cdr.markForCheck(); // Ensure UI updates
      },
      error: (err) => {
        console.error('WorkoutTemplatesComponent: Error', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  createTemplate() {
    this.router.navigate(['/workouts/create']);
  }

  startWorkout(templateId: string) {
    this.router.navigate(['/workouts/active', templateId]);
  }
}
