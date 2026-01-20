# FitTracker

A modern full-stack fitness tracking application demonstrating enterprise-level architecture patterns with .NET 9 and Angular.

Deployed using Vercel, Render, and MongoDB Atlas.

## Overview

FitTracker is a comprehensive workout tracking solution that allows users to manage exercises, create workout templates, log training sessions, and track body measurements over time.

## Features

**Exercise Management**
- Full CRUD operations for exercise catalog
- Muscle group categorization

**Workout Planning**
- Create reusable workout templates
- Drag-and-drop exercise ordering

**Session Logging**
- Record sets, reps, and weights
- View previous session data for comparison

**Progress Tracking**
- Body measurements logging
- Historical data visualization

**User Experience**
- Dark and light theme support
- Multi-language interface (English, Polish)
- Progressive Web App capabilities

## Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| .NET 9 | Runtime platform and Web API |
| MediatR | CQRS and request handling |
| FluentValidation | Input validation |
| Carter | Modular endpoint organization |
| MongoDB | Database (with in-memory option) |

### Frontend

| Technology | Purpose |
|------------|---------|
| Angular | SPA framework |
| Angular Material | UI components |
| TypeScript | Type-safe JavaScript |
| RxJS | Reactive programming |
| ngx-translate | Internationalization |
| Chart.js | Data visualization |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Docker | Containerization |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| MongoDB Atlas | Cloud database |

## Architecture

The project follows vertical slice architecture with CQRS pattern:

```
FitTracker/
├── FitTracker.ApiService/
│   ├── Infrastructure/
│   └── Modules/
│       ├── Exercises/
│       ├── Workouts/
│       └── Measurements/
├── FitTracker.ServiceDefaults/
└── fit-tracker-web/
    └── src/
        ├── app/features/
        └── environments/
```

## Design Patterns

- **Vertical Slice Architecture** - Each feature is self-contained
- **CQRS** - Separation of read and write operations
- **Minimal APIs** - Lightweight HTTP endpoints
- **Standalone Components** - Modern Angular architecture

## Author

Marcin Bogdanski

---

Portfolio project demonstrating proficiency in modern full-stack development with .NET and Angular.