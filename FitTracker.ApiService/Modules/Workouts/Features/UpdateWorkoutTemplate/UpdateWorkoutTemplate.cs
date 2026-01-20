using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Workouts.Features.UpdateWorkoutTemplate;

public static class UpdateWorkoutTemplate
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/api/workouts/templates/{id}", async (string id, UpdateWorkoutTemplateRequest request, ISender sender) =>
            {
                var command = new UpdateWorkoutTemplateCommand(id, "user-1", request);
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

    public class UpdateWorkoutTemplateHandler(InMemoryDataStore store) : IRequestHandler<UpdateWorkoutTemplateCommand>
    {
        public Task Handle(UpdateWorkoutTemplateCommand request, CancellationToken cancellationToken)
        {
            var template = store.WorkoutTemplates.FirstOrDefault(x => x.Id == request.Id);
            if (template != null)
            {
                template.Name = request.Data.Name;
                template.ExerciseIds = request.Data.ExerciseIds;
            }
            return Task.CompletedTask;
        }
    }
}
