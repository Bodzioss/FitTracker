using Carter;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.DeleteWorkoutTemplate;

public static class DeleteWorkoutTemplate
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/api/workouts/templates/{id}", async (string id, ISender sender) =>
            {
                var command = new DeleteWorkoutTemplateCommand(id, "user-1"); // MVP User
                await sender.Send(command);
                return Results.NoContent();
            })
            .WithTags("Workouts");
        }
    }

    public record DeleteWorkoutTemplateCommand(string Id, string UserId) : IRequest;

    public class DeleteWorkoutTemplateHandler(IMongoDatabase database) : IRequestHandler<DeleteWorkoutTemplateCommand>
    {
        private readonly IMongoCollection<WorkoutTemplate> _collection = database.GetCollection<WorkoutTemplate>("workout_templates");

        public async Task Handle(DeleteWorkoutTemplateCommand request, CancellationToken cancellationToken)
        {
            var filter = Builders<WorkoutTemplate>.Filter.Eq(x => x.Id, request.Id);
            // In a real app we might verify UserId here too
            await _collection.DeleteOneAsync(filter, cancellationToken: cancellationToken);
        }
    }
}
