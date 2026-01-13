using Carter;
using FluentValidation;
using MediatR;
using MongoDB.Driver;

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

    public class CreateExerciseHandler(IMongoDatabase database) : IRequestHandler<CreateExerciseCommand, string>
    {
        private readonly IMongoCollection<Exercise> _collection = database.GetCollection<Exercise>("exercises");

        public async Task<string> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            var entity = new Exercise
            {
                Name = request.Name,
                MuscleGroup = request.MuscleGroup,
                Description = request.Description
            };

            await _collection.InsertOneAsync(entity, cancellationToken: cancellationToken);

            return entity.Id;
        }
    }

    // --- Get Exercises ---

    public record GetExercisesQuery : IRequest<List<Exercise>>;

    public class GetExercisesHandler(IMongoDatabase database) : IRequestHandler<GetExercisesQuery, List<Exercise>>
    {
        private readonly IMongoCollection<Exercise> _collection = database.GetCollection<Exercise>("exercises");

        public async Task<List<Exercise>> Handle(GetExercisesQuery request, CancellationToken cancellationToken)
        {
            return await _collection.Find(_ => true).ToListAsync(cancellationToken);
        }
    }
}
