import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutTemplate, WorkoutSession } from '../../../core/models/workout.model';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    private http = inject(HttpClient);
    private readonly API_URL = '/api/workouts';

    // Templates
    createTemplate(template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.API_URL}/templates`, template);
    }

    getTemplates(): Observable<WorkoutTemplate[]> {
        return this.http.get<WorkoutTemplate[]>(`${this.API_URL}/templates`);
    }

    // Sessions
    logSession(session: Omit<WorkoutSession, 'id' | 'userId'>): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.API_URL}/sessions`, session);
    }

    getSessions(): Observable<WorkoutSession[]> {
        return this.http.get<WorkoutSession[]>(`${this.API_URL}/sessions`);
    }
}
