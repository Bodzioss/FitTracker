import { Routes } from '@angular/router';
import { ManageExercisesComponent } from './features/exercises/components/manage-exercises/manage-exercises.component';
import { DashboardComponent } from './features/core/components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'exercises', component: ManageExercisesComponent },
    { path: 'measurements', loadComponent: () => import('./features/measurements/components/log-measurements/log-measurements.component').then(m => m.LogMeasurementsComponent) },
    { path: 'workouts', loadComponent: () => import('./features/workouts/components/workout-templates/workout-templates.component').then(m => m.WorkoutTemplatesComponent) },
    { path: 'workouts/create', loadComponent: () => import('./features/workouts/components/create-template/create-template.component').then(m => m.CreateTemplateComponent) },
    { path: 'workouts/edit/:id', loadComponent: () => import('./features/workouts/components/create-template/create-template.component').then(m => m.CreateTemplateComponent) },
    { path: 'workouts/active/:templateId', loadComponent: () => import('./features/workouts/components/active-workout/active-workout.component').then(m => m.ActiveWorkoutComponent) },
    { path: 'workouts/history', loadComponent: () => import('./features/workouts/components/workout-history/workout-history.component').then(m => m.WorkoutHistoryComponent) }
];
