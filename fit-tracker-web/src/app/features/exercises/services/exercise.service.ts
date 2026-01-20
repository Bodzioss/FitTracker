import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExerciseRequest, Exercise } from '../../../core/models/exercise.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/exercises`;

    getExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(this.API_URL);
    }

    createExercise(request: CreateExerciseRequest): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(this.API_URL, request);
    }

    updateExercise(id: string, request: CreateExerciseRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, request);
    }

    deleteExercise(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
