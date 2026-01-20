namespace FitTracker.ApiService.Infrastructure;

public class InMemoryDataStore
{
    public List<Exercise> Exercises { get; } = new();
    public List<WorkoutTemplate> WorkoutTemplates { get; } = new();
    public List<WorkoutSession> WorkoutSessions { get; } = new();
    public List<Measurement> Measurements { get; } = new();

    public InMemoryDataStore()
    {
        SeedData();
    }

    private void SeedData()
    {
        // Sample Exercises
        Exercises.AddRange(new[]
        {
            new Exercise { Id = "ex1", Name = "Bench Press", Description = "Classic flat bench barbell press", MuscleGroup = "Chest", UserId = "user-1" },
            new Exercise { Id = "ex2", Name = "Squat", Description = "Barbell back squat - fundamental leg exercise", MuscleGroup = "Legs", UserId = "user-1" },
            new Exercise { Id = "ex3", Name = "Deadlift", Description = "Conventional deadlift for back and legs", MuscleGroup = "Back", UserId = "user-1" },
            new Exercise { Id = "ex4", Name = "Pull-ups", Description = "Overhand grip pull-ups on bar", MuscleGroup = "Back", UserId = "user-1" },
            new Exercise { Id = "ex5", Name = "Overhead Press", Description = "Standing barbell shoulder press", MuscleGroup = "Shoulders", UserId = "user-1" },
            new Exercise { Id = "ex6", Name = "Barbell Curl", Description = "Standing barbell bicep curls", MuscleGroup = "Biceps", UserId = "user-1" },
            new Exercise { Id = "ex7", Name = "Dips", Description = "Parallel bar dips for triceps", MuscleGroup = "Triceps", UserId = "user-1" },
            new Exercise { Id = "ex8", Name = "Lateral Raises", Description = "Dumbbell lateral raises for shoulders", MuscleGroup = "Shoulders", UserId = "user-1" },
        });

        // Sample Workout Templates
        WorkoutTemplates.AddRange(new[]
        {
            new WorkoutTemplate
            {
                Id = "t1",
                UserId = "user-1",
                Name = "Push Day",
                Description = "Chest, shoulders and triceps workout",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                ExerciseIds = new List<string> { "ex1", "ex5", "ex7", "ex8" }
            },
            new WorkoutTemplate
            {
                Id = "t2",
                UserId = "user-1",
                Name = "Pull Day",
                Description = "Back and biceps workout",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                ExerciseIds = new List<string> { "ex3", "ex4", "ex6" }
            },
            new WorkoutTemplate
            {
                Id = "t3",
                UserId = "user-1",
                Name = "Leg Day",
                Description = "Complete leg workout",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                ExerciseIds = new List<string> { "ex2", "ex3" }
            }
        });

        // Sample Workout Sessions (history)
        WorkoutSessions.AddRange(new[]
        {
            new WorkoutSession
            {
                Id = "s1",
                UserId = "user-1",
                TemplateId = "t1",
                Date = DateTime.UtcNow.AddDays(-7),
                Exercises = new List<ExerciseLog>
                {
                    new ExerciseLog { ExerciseId = "ex1", Sets = new List<SetLog> { new(80, 10), new(85, 8), new(90, 6) } },
                    new ExerciseLog { ExerciseId = "ex5", Sets = new List<SetLog> { new(40, 10), new(45, 8), new(45, 7) } },
                    new ExerciseLog { ExerciseId = "ex7", Sets = new List<SetLog> { new(0, 12), new(0, 10), new(0, 8) } },
                }
            },
            new WorkoutSession
            {
                Id = "s2",
                UserId = "user-1",
                TemplateId = "t2",
                Date = DateTime.UtcNow.AddDays(-5),
                Exercises = new List<ExerciseLog>
                {
                    new ExerciseLog { ExerciseId = "ex3", Sets = new List<SetLog> { new(100, 8), new(110, 6), new(120, 4) } },
                    new ExerciseLog { ExerciseId = "ex4", Sets = new List<SetLog> { new(0, 10), new(0, 8), new(0, 6) } },
                    new ExerciseLog { ExerciseId = "ex6", Sets = new List<SetLog> { new(20, 12), new(22, 10), new(25, 8) } },
                }
            },
            new WorkoutSession
            {
                Id = "s3",
                UserId = "user-1",
                TemplateId = "t3",
                Date = DateTime.UtcNow.AddDays(-3),
                Exercises = new List<ExerciseLog>
                {
                    new ExerciseLog { ExerciseId = "ex2", Sets = new List<SetLog> { new(80, 10), new(90, 8), new(100, 6) } },
                    new ExerciseLog { ExerciseId = "ex3", Sets = new List<SetLog> { new(110, 6), new(120, 5), new(130, 4) } },
                }
            }
        });

        // Sample Measurements
        Measurements.AddRange(new[]
        {
            new Measurement { Id = "m1", UserId = "user-1", Date = DateTime.UtcNow.AddDays(-30), Weight = 75, Height = 180, Chest = 95, Waist = 80, Hips = 95, Bicep = 35, Thigh = 55, Calf = 38 },
            new Measurement { Id = "m2", UserId = "user-1", Date = DateTime.UtcNow.AddDays(-14), Weight = 76, Height = 180, Chest = 96, Waist = 79, Hips = 95, Bicep = 36, Thigh = 56, Calf = 38 },
            new Measurement { Id = "m3", UserId = "user-1", Date = DateTime.UtcNow.AddDays(-1), Weight = 77, Height = 180, Chest = 97, Waist = 78, Hips = 96, Bicep = 37, Thigh = 57, Calf = 39 },
        });
    }
}

// Models
public record Exercise
{
    public string Id { get; set; } = "";
    public string UserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string MuscleGroup { get; set; } = "";
}

public record WorkoutTemplate
{
    public string Id { get; set; } = "";
    public string UserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> ExerciseIds { get; set; } = new();
}

public record WorkoutSession
{
    public string Id { get; set; } = "";
    public string UserId { get; set; } = "";
    public string TemplateId { get; set; } = "";
    public DateTime Date { get; set; }
    public List<ExerciseLog> Exercises { get; set; } = new();
}

public record ExerciseLog
{
    public string ExerciseId { get; set; } = "";
    public List<SetLog> Sets { get; set; } = new();
}

public record SetLog(decimal Weight, int Reps);

public record Measurement
{
    public string Id { get; set; } = "";
    public string UserId { get; set; } = "";
    public DateTime Date { get; set; }
    public decimal? Weight { get; set; }
    public decimal? Height { get; set; }
    public decimal? Chest { get; set; }
    public decimal? Waist { get; set; }
    public decimal? Hips { get; set; }
    public decimal? Bicep { get; set; }
    public decimal? Thigh { get; set; }
    public decimal? Calf { get; set; }
}

