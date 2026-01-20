import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutTemplate, WorkoutSession } from '../../../core/models/workout.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/workouts`;

    // Templates
    createTemplate(template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.API_URL}/templates`, template);
    }

    getTemplates(): Observable<WorkoutTemplate[]> {
        return this.http.get<WorkoutTemplate[]>(`${this.API_URL}/templates`);
    }

    updateTemplate(id: string, template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/templates/${id}`, template);
    }

    deleteTemplate(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/templates/${id}`);
    }

    // Sessions
    logSession(session: Omit<WorkoutSession, 'id' | 'userId'>): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.API_URL}/sessions`, session);
    }

    getSessions(): Observable<WorkoutSession[]> {
        return this.http.get<WorkoutSession[]>(`${this.API_URL}/sessions`);
    }
}
