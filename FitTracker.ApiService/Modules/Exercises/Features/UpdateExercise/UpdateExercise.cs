using Carter;
using MediatR;
using FluentValidation;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Exercises.Features.UpdateExercise;

public static class UpdateExercise
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/api/exercises/{id}", async (string id, UpdateExerciseRequest request, ISender sender) =>
            {
                var command = new UpdateExerciseCommand(id, request.Name, request.MuscleGroup, request.Description);
                await sender.Send(command);
                return Results.NoContent();
            })
            .WithTags("Exercises");
        }
    }

    public record UpdateExerciseRequest(string Name, string MuscleGroup, string Description);
    public record UpdateExerciseCommand(string Id, string Name, string MuscleGroup, string Description) : IRequest;

    public class Handler(IMongoDatabase database) : IRequestHandler<UpdateExerciseCommand>
    {
        private readonly IMongoCollection<Exercise> _collection = database.GetCollection<Exercise>("exercises");

        public async Task Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
        {
            var update = Builders<Exercise>.Update
                .Set(x => x.Name, request.Name)
                .Set(x => x.MuscleGroup, request.MuscleGroup)
                .Set(x => x.Description, request.Description);

            await _collection.UpdateOneAsync(x => x.Id == request.Id, update, cancellationToken: cancellationToken);
        }
    }
}
