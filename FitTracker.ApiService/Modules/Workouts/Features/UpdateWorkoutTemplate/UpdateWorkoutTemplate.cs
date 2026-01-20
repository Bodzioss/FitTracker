using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.UpdateWorkoutTemplate;

public static class UpdateWorkoutTemplate
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/api/workouts/templates/{id}", async (string id, UpdateWorkoutTemplateRequest request, ISender sender) =>
            {
                var command = new UpdateWorkoutTemplateCommand(id, "user-1", request); // MVP User
                await sender.Send(command);
                return Results.NoContent();
            })
            .WithTags("Workouts");
        }
    }

    public record UpdateWorkoutTemplateRequest(string Name, List<string> ExerciseIds);

    public record UpdateWorkoutTemplateCommand(string Id, string UserId, UpdateWorkoutTemplateRequest Data) : IRequest;

    public class UpdateWorkoutTemplateValidator : AbstractValidator<UpdateWorkoutTemplateCommand>
    {
        public UpdateWorkoutTemplateValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Data.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Data.ExerciseIds).NotEmpty().WithMessage("Workout must have at least one exercise.");
        }
    }

    public class UpdateWorkoutTemplateHandler(IMongoDatabase database) : IRequestHandler<UpdateWorkoutTemplateCommand>
    {
        private readonly IMongoCollection<WorkoutTemplate> _collection = database.GetCollection<WorkoutTemplate>("workout_templates");

        public async Task Handle(UpdateWorkoutTemplateCommand request, CancellationToken cancellationToken)
        {
            var filter = Builders<WorkoutTemplate>.Filter.Eq(x => x.Id, request.Id);
            var update = Builders<WorkoutTemplate>.Update
                .Set(x => x.Name, request.Data.Name)
                .Set(x => x.ExerciseIds, request.Data.ExerciseIds); // Updating exercises too

            await _collection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        }
    }
}
