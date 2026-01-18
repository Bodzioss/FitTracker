import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LogMeasurementRequest, Measurement } from '../../../core/models/measurement.model';

@Injectable({
    providedIn: 'root'
})
export class MeasurementService {
    private http = inject(HttpClient);
    private readonly API_URL = '/api/measurements';

    logMeasurement(request: LogMeasurementRequest): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(this.API_URL, request);
    }

    getMeasurements(): Observable<Measurement[]> {
        return this.http.get<Measurement[]>(this.API_URL);
    }
}
