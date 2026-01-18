import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Measurement } from '../../../../core/models/measurement.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-measurement-chart-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, BaseChartDirective, TranslateModule],
    template: `
    <h2 mat-dialog-title>{{ 'MEASUREMENTS.' + data.metric.toUpperCase() | translate }} - {{ 'MEASUREMENTS.HISTORY' | translate }}</h2>
    <mat-dialog-content>
      <div class="chart-container">
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="'line'">
        </canvas>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .chart-container {
      position: relative;
      height: 40vh;
      width: 100%;
      min-width: 300px;
    }
  `]
})
export class MeasurementChartDialogComponent implements OnInit {
    lineChartData: ChartConfiguration<'line'>['data'] = {
        datasets: [],
        labels: []
    };

    lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false } // Hide legend as title says it all
        }
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { history: Measurement[], metric: keyof Measurement },
        private translate: TranslateService
    ) { }

    ngOnInit() {
        // Sort history by date ascending for chart (oldest first)
        const sortedHistory = [...this.data.history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.lineChartData = {
            labels: sortedHistory.map(m => new Date(m.date).toLocaleDateString()),
            datasets: [
                {
                    data: sortedHistory.map(m => Number(m[this.data.metric])),
                    label: this.translate.instant('MEASUREMENTS.' + this.data.metric.toUpperCase()),
                    fill: true,
                    tension: 0.4, // Smooth curve
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#1976d2',
                    pointHoverBackgroundColor: '#1976d2',
                    pointHoverBorderColor: '#fff'
                }
            ]
        };
    }
}
