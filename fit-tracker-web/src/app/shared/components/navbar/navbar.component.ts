import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule
    ],
    template: `
    <mat-toolbar color="primary" class="navbar">
      <span class="logo" routerLink="/">FitTracker</span>
      
      <span class="spacer"></span>

      <!-- Language Switch -->
      <button mat-button [matMenuTriggerFor]="langMenu">
        <mat-icon>language</mat-icon>
        <span class="lang-text">{{ currentLang().toUpperCase() }}</span>
      </button>
      <mat-menu #langMenu="matMenu">
        <button mat-menu-item (click)="setLang('pl')">
          <span [class.active-lang]="currentLang() === 'pl'">Polski</span>
        </button>
        <button mat-menu-item (click)="setLang('en')">
          <span [class.active-lang]="currentLang() === 'en'">English</span>
        </button>
      </mat-menu>

      <!-- Theme Switch -->
      <button mat-icon-button (click)="toggleTheme()" [matTooltip]="isDark() ? 'Light Mode' : 'Dark Mode'">
        <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </mat-toolbar>
  `,
    styles: [`
    .navbar { box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
    .logo { font-weight: bold; cursor: pointer; user-select: none; }
    .spacer { flex: 1 1 auto; }
    .lang-text { margin-left: 4px; }
    .active-lang { font-weight: bold; color: #1976d2; }
  `]
})
export class NavbarComponent implements OnInit {
    private translate = inject(TranslateService);

    // State
    currentLang = signal('pl');
    isDark = signal(false);

    constructor() {
        // Restore state from local storage on init logic
    }

    ngOnInit() {
        // Language
        const savedLang = localStorage.getItem('lang') || 'pl';
        this.setLang(savedLang);

        // Theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDark.set(true);
            this.applyTheme(true);
        }
    }

    setLang(lang: string) {
        this.translate.use(lang);
        this.currentLang.set(lang);
        localStorage.setItem('lang', lang);
    }

    toggleTheme() {
        this.isDark.update(v => !v);
        const dark = this.isDark();
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        this.applyTheme(dark);
    }

    private applyTheme(isDark: boolean) {
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}
