import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatRippleModule,
        RouterModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    menuItems = [
        { label: 'Nowy Trening', icon: 'add_circle', route: '/create-workout', color: '#4caf50' },
        { label: 'Baza Ćwiczeń', icon: 'fitness_center', route: '/exercises', color: '#2196f3' },
        { label: 'Historia', icon: 'history', route: '/history', color: '#ff9800' }, // Placeholder
        { label: 'Statystyki', icon: 'bar_chart', route: '/stats', color: '#9c27b0' } // Placeholder
    ];

    constructor(private router: Router) { }

    navigate(route: string) {
        this.router.navigate([route]);
    }
}
