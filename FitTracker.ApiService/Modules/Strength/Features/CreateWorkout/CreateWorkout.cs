using FluentValidation;
using MediatR;
using MongoDB.Bson;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Strength.Features.CreateWorkout;

// 1. Request DTO
public record CreateWorkoutRequest(
    DateTime Date,
    string? Notes,
    List<WorkoutExerciseDto> Exercises);

public record WorkoutExerciseDto(string ExerciseId, string Name, List<WorkoutSetDto> Sets);
public record WorkoutSetDto(double Weight, int Reps, double Rpe);

// 2. Command (MediatR)
public record CreateWorkoutCommand(string UserId, CreateWorkoutRequest Workout) : IRequest<string>;

// 3. Validator
public class CreateWorkoutValidator : AbstractValidator<CreateWorkoutCommand>
{
    public CreateWorkoutValidator()
    {
        RuleFor(x => x.Workout.Date).NotEmpty();
        RuleFor(x => x.Workout.Exercises).NotEmpty();
    }
}

// 4. Handler
public class CreateWorkoutHandler(IMongoDatabase database) : IRequestHandler<CreateWorkoutCommand, string>
{
    private readonly IMongoCollection<BsonDocument> _collection = database.GetCollection<BsonDocument>("workouts");

    public async Task<string> Handle(CreateWorkoutCommand request, CancellationToken cancellationToken)
    {
        var doc = new BsonDocument
        {
            { "userId", request.UserId },
            { "date", request.Workout.Date },
            { "notes", request.Workout.Notes },
            { "exercises", new BsonArray(request.Workout.Exercises.Select(e => new BsonDocument {
                { "exerciseId", ObjectId.Parse(e.ExerciseId) },
                { "snapshotName", e.Name },
                { "sets", new BsonArray(e.Sets.Select(s => new BsonDocument {
                    { "weight", s.Weight },
                    { "reps", s.Reps },
                    { "rpe", s.Rpe }
                }))}
            }))}
        };

        await _collection.InsertOneAsync(doc, cancellationToken: cancellationToken);
        return doc["_id"].ToString()!;
    }
}

// 5. Endpoint Definition
public static class CreateWorkoutEndpoint
{
    public static void MapCreateWorkout(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/workouts", async (CreateWorkoutRequest request, ISender sender) =>
        {
            // Hardcoded UserId na start MVP
            var command = new CreateWorkoutCommand("user-1", request);
            var id = await sender.Send(command);
            return Results.Created($"/api/workouts/{id}", new { Id = id });
        })
        .WithTags("Workouts");
    }
}
