using Carter;
using MediatR;
using FluentValidation;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Exercises.Features.DeleteExercise;

public static class DeleteExercise
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/api/exercises/{id}", async (string id, ISender sender) =>
            {
                await sender.Send(new DeleteExerciseCommand(id));
                return Results.NoContent();
            })
            .WithTags("Exercises");
        }
    }

    public record DeleteExerciseCommand(string Id) : IRequest;

    public class Handler(IMongoDatabase database) : IRequestHandler<DeleteExerciseCommand>
    {
        private readonly IMongoCollection<Exercise> _collection = database.GetCollection<Exercise>("exercises");

        public async Task Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
        {
            await _collection.DeleteOneAsync(x => x.Id == request.Id, cancellationToken);
        }
    }
}
