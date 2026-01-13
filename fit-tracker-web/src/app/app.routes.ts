import { Routes } from '@angular/router';
import { CreateWorkoutComponent } from './features/strength/components/create-workout/create-workout.component';
import { ManageExercisesComponent } from './features/exercises/components/manage-exercises/manage-exercises.component';

import { DashboardComponent } from './features/core/components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'create-workout', component: CreateWorkoutComponent },
    { path: 'exercises', component: ManageExercisesComponent }
];
