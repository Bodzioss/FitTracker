import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkoutRequest } from '../../../core/models/workout.model';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    private http = inject(HttpClient);

    createWorkout(workout: WorkoutRequest): Observable<{ id: string }> {
        return this.http.post<{ id: string }>('/api/workouts', workout);
    }
}
