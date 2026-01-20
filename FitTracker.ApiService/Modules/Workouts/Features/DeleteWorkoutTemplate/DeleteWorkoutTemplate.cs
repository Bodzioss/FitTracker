using Carter;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Workouts.Features.DeleteWorkoutTemplate;

public static class DeleteWorkoutTemplate
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/api/workouts/templates/{id}", async (string id, ISender sender) =>
            {
                var command = new DeleteWorkoutTemplateCommand(id, "user-1");
                await sender.Send(command);
                return Results.NoContent();
            })
            .WithTags("Workouts");
        }
    }

    public record DeleteWorkoutTemplateCommand(string Id, string UserId) : IRequest;

    public class DeleteWorkoutTemplateHandler(InMemoryDataStore store) : IRequestHandler<DeleteWorkoutTemplateCommand>
    {
        public Task Handle(DeleteWorkoutTemplateCommand request, CancellationToken cancellationToken)
        {
            var template = store.WorkoutTemplates.FirstOrDefault(x => x.Id == request.Id);
            if (template != null)
            {
                store.WorkoutTemplates.Remove(template);
            }
            return Task.CompletedTask;
        }
    }
}
