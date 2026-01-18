namespace FitTracker.ApiService.Modules.Workouts.Models;

public class WorkoutSession
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty; // Pusty string jesli trening "wolny" (bez szablonu)
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public List<ExerciseLog> Exercises { get; set; } = new();
}

public class ExerciseLog
{
    public string ExerciseId { get; set; } = string.Empty;
    public List<SetLog> Sets { get; set; } = new();
}

public class SetLog
{
    public int Reps { get; set; }
    public double Weight { get; set; }
}
