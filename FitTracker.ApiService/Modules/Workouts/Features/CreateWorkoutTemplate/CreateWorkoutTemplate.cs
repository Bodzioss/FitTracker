using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.CreateWorkoutTemplate;

public static class CreateWorkoutTemplate
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/workouts/templates", async (CreateWorkoutTemplateRequest request, ISender sender) =>
            {
                var command = new CreateWorkoutTemplateCommand("user-1", request); // MVP User
                var id = await sender.Send(command);
                return Results.Created($"/api/workouts/templates/{id}", new { Id = id });
            })
            .WithTags("Workouts");
        }
    }

    public record CreateWorkoutTemplateRequest(string Name, List<string> ExerciseIds);

    public record CreateWorkoutTemplateCommand(string UserId, CreateWorkoutTemplateRequest Data) : IRequest<string>;

    public class CreateWorkoutTemplateValidator : AbstractValidator<CreateWorkoutTemplateCommand>
    {
        public CreateWorkoutTemplateValidator()
        {
            RuleFor(x => x.Data.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Data.ExerciseIds).NotEmpty().WithMessage("Workout must have at least one exercise.");
        }
    }

    public class CreateWorkoutTemplateHandler(IMongoDatabase database) : IRequestHandler<CreateWorkoutTemplateCommand, string>
    {
        private readonly IMongoCollection<WorkoutTemplate> _collection = database.GetCollection<WorkoutTemplate>("workout_templates");

        public async Task<string> Handle(CreateWorkoutTemplateCommand request, CancellationToken cancellationToken)
        {
            var entity = new WorkoutTemplate
            {
                UserId = request.UserId,
                Name = request.Data.Name,
                ExerciseIds = request.Data.ExerciseIds,
                CreatedAt = DateTime.UtcNow
            };

            await _collection.InsertOneAsync(entity, cancellationToken: cancellationToken);

            return entity.Id;
        }
    }
}
