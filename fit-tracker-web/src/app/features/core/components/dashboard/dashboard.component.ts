import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatRippleModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    menuItems = [
        { label: 'DASHBOARD.NEW_WORKOUT', icon: 'add_circle', color: '#4caf50', link: '/workouts' },
        { label: 'DASHBOARD.EXERCISE_DB', icon: 'fitness_center', color: '#ff9800', link: '/exercises' },
        { label: 'DASHBOARD.MEASUREMENTS', icon: 'straighten', color: '#2196f3', link: '/measurements' },
        { label: 'DASHBOARD.HISTORY', icon: 'history', color: '#9c27b0', link: '/workouts/history' }
    ];

    constructor(private router: Router) { }

    navigate(route: string) {
        this.router.navigate([route]);
    }
}
