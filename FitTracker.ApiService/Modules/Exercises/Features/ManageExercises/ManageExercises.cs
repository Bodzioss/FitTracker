using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Exercises.Features.ManageExercises;

public static class ManageExercises
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/exercises", async (CreateExerciseCommand command, ISender sender) =>
            {
                var id = await sender.Send(command);
                return Results.Created($"/api/exercises/{id}", new { Id = id });
            });

            app.MapGet("/api/exercises", async (ISender sender) =>
            {
                var result = await sender.Send(new GetExercisesQuery());
                return Results.Ok(result);
            });

            app.MapPut("/api/exercises/{id}", async (string id, UpdateExerciseCommand command, ISender sender) =>
            {
                await sender.Send(command with { Id = id });
                return Results.NoContent();
            });

            app.MapDelete("/api/exercises/{id}", async (string id, ISender sender) =>
            {
                await sender.Send(new DeleteExerciseCommand(id));
                return Results.NoContent();
            });
        }
    }

    // --- Create Exercise ---
    public record CreateExerciseCommand(string Name, string MuscleGroup, string? Description) : IRequest<string>;

    public class CreateExerciseValidator : AbstractValidator<CreateExerciseCommand>
    {
        public CreateExerciseValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.MuscleGroup).NotEmpty();
        }
    }

    public class CreateExerciseHandler(InMemoryDataStore store) : IRequestHandler<CreateExerciseCommand, string>
    {
        public Task<string> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            var entity = new Exercise
            {
                Id = Guid.NewGuid().ToString(),
                UserId = "user-1",
                Name = request.Name,
                MuscleGroup = request.MuscleGroup,
                Description = request.Description
            };

            store.Exercises.Add(entity);
            return Task.FromResult(entity.Id);
        }
    }

    // --- Get Exercises ---
    public record GetExercisesQuery : IRequest<List<Exercise>>;

    public class GetExercisesHandler(InMemoryDataStore store) : IRequestHandler<GetExercisesQuery, List<Exercise>>
    {
        public Task<List<Exercise>> Handle(GetExercisesQuery request, CancellationToken cancellationToken)
        {
            return Task.FromResult(store.Exercises.ToList());
        }
    }

    // --- Update Exercise ---
    public record UpdateExerciseCommand(string Id, string Name, string MuscleGroup, string? Description) : IRequest;

    public class UpdateExerciseHandler(InMemoryDataStore store) : IRequestHandler<UpdateExerciseCommand>
    {
        public Task Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = store.Exercises.FirstOrDefault(e => e.Id == request.Id);
            if (exercise != null)
            {
                exercise.Name = request.Name;
                exercise.MuscleGroup = request.MuscleGroup;
                exercise.Description = request.Description;
            }
            return Task.CompletedTask;
        }
    }

    // --- Delete Exercise ---
    public record DeleteExerciseCommand(string Id) : IRequest;

    public class DeleteExerciseHandler(InMemoryDataStore store) : IRequestHandler<DeleteExerciseCommand>
    {
        public Task Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = store.Exercises.FirstOrDefault(e => e.Id == request.Id);
            if (exercise != null)
            {
                store.Exercises.Remove(exercise);
            }
            return Task.CompletedTask;
        }
    }
}
