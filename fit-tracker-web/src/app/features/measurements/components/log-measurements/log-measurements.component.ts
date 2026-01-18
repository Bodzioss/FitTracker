import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// App Imports
import { MeasurementService } from '../../services/measurement.service';
import { LogMeasurementRequest, Measurement } from '../../../../core/models/measurement.model';
import { MeasurementChartDialogComponent } from '../measurement-chart-dialog/measurement-chart-dialog.component';

@Component({
    selector: 'app-log-measurements',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        DatePipe
    ],
    templateUrl: './log-measurements.component.html',
    styleUrls: ['./log-measurements.component.scss']
})
export class LogMeasurementsComponent {
    private fb = inject(NonNullableFormBuilder);
    private service = inject(MeasurementService);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);
    private dialog = inject(MatDialog);
    private translate = inject(TranslateService);
    private cd = inject(ChangeDetectorRef);

    history: Measurement[] = [];

    constructor() {
        this.loadHistory();
    }

    form = this.fb.group({
        weight: [0, [Validators.required, Validators.min(1)]],
        height: [0, [Validators.required, Validators.min(1)]],
        chest: [0, [Validators.required, Validators.min(1)]],
        waist: [0, [Validators.required, Validators.min(1)]],
        hips: [0, [Validators.required, Validators.min(1)]],
        bicep: [0, [Validators.required, Validators.min(1)]],
        thigh: [0, [Validators.required, Validators.min(1)]],
        calf: [0, [Validators.required, Validators.min(1)]]
    });

    loadHistory() {
        this.service.getMeasurements().subscribe(data => {
            this.history = data;
            this.cd.detectChanges();
        });
    }

    goBack() {
        this.router.navigate(['/']);
    }

    // Add trackBy function for performance and stability
    trackByFn(index: number, item: Measurement): string {
        return item.id || index.toString();
    }

    openChart(metric: string) {
        if (this.history.length < 2) {
            this.snackBar.open(this.translate.instant('MEASUREMENTS.NOT_ENOUGH_DATA'), 'OK', { duration: 3000 });
            // continue anyway for demo/UX
        }

        // Assert metric as keyof Measurement manually since string comes from template
        this.dialog.open(MeasurementChartDialogComponent, {
            width: '90vw',
            maxWidth: '600px',
            data: { history: this.history, metric: metric as keyof Measurement }
        });
    }

    submit() {
        if (this.form.invalid) return;

        const request = this.form.getRawValue();

        this.service.logMeasurement(request).subscribe({
            next: (response) => {
                this.snackBar.open(this.translate.instant('MEASUREMENTS.SUCCESS'), 'OK', { duration: 3000 });

                // Optimistic UI update: Create a temp measurement object and prepend to history
                const newMeasurement: Measurement = {
                    id: response.id,
                    userId: 'user-1', // Placeholder
                    date: new Date(), // Current time
                    ...request,
                    // Ensure all numbers are present (defaulting to 0 if undefined, though validators prevent that)
                    weight: request.weight || 0,
                    height: request.height || 0,
                    chest: request.chest || 0,
                    waist: request.waist || 0,
                    hips: request.hips || 0,
                    bicep: request.bicep || 0,
                    thigh: request.thigh || 0,
                    calf: request.calf || 0
                };

                this.history = [newMeasurement, ...this.history];

                // Manually trigger change detection to fix NG0100 and ensure view update
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Error saving measurement', 'OK', { duration: 3000 });
            }
        });
    }
}
