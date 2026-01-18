using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.LogWorkoutSession;

public static class LogWorkoutSession
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/workouts/sessions", async (LogWorkoutSessionRequest request, ISender sender) =>
            {
                var command = new LogWorkoutSessionCommand("user-1", request); // MVP User
                var id = await sender.Send(command);
                return Results.Created($"/api/workouts/sessions/{id}", new { Id = id });
            })
            .WithTags("Workouts");
        }
    }

    public record LogWorkoutSessionRequest(string TemplateId, DateTime? Date, List<ExerciseLogDto> Exercises);
    public record ExerciseLogDto(string ExerciseId, List<SetLogDto> Sets);
    public record SetLogDto(int Reps, double Weight);

    public record LogWorkoutSessionCommand(string UserId, LogWorkoutSessionRequest Data) : IRequest<string>;

    public class LogWorkoutSessionValidator : AbstractValidator<LogWorkoutSessionCommand>
    {
        public LogWorkoutSessionValidator()
        {
            RuleFor(x => x.Data.Exercises).NotEmpty();
            RuleForEach(x => x.Data.Exercises).ChildRules(exercise =>
            {
                exercise.RuleFor(e => e.ExerciseId).NotEmpty();
                exercise.RuleFor(e => e.Sets).NotEmpty();
                exercise.RuleForEach(s => s.Sets).ChildRules(set =>
                {
                    set.RuleFor(s => s.Reps).GreaterThan(0);
                    set.RuleFor(s => s.Weight).GreaterThan(0);
                });
            });
        }
    }

    public class LogWorkoutSessionHandler(IMongoDatabase database) : IRequestHandler<LogWorkoutSessionCommand, string>
    {
        private readonly IMongoCollection<WorkoutSession> _collection = database.GetCollection<WorkoutSession>("workout_sessions");

        public async Task<string> Handle(LogWorkoutSessionCommand request, CancellationToken cancellationToken)
        {
            var entity = new WorkoutSession
            {
                UserId = request.UserId,
                TemplateId = request.Data.TemplateId ?? string.Empty,
                Date = request.Data.Date ?? DateTime.UtcNow,
                Exercises = request.Data.Exercises.Select(e => new ExerciseLog
                {
                    ExerciseId = e.ExerciseId,
                    Sets = e.Sets.Select(s => new SetLog
                    {
                        Reps = s.Reps,
                        Weight = s.Weight
                    }).ToList()
                }).ToList()
            };

            await _collection.InsertOneAsync(entity, cancellationToken: cancellationToken);

            return entity.Id;
        }
    }
}
