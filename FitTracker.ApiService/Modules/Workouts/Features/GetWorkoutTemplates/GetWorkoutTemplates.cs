using Carter;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.GetWorkoutTemplates;

public static class GetWorkoutTemplates
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/workouts/templates", async (ISender sender) =>
            {
                var query = new GetWorkoutTemplatesQuery("user-1"); // MVP User
                var result = await sender.Send(query);
                return Results.Ok(result);
            })
            .WithTags("Workouts");
        }
    }

    public record GetWorkoutTemplatesQuery(string UserId) : IRequest<List<WorkoutTemplate>>;

    public class GetWorkoutTemplatesHandler(IMongoDatabase database) : IRequestHandler<GetWorkoutTemplatesQuery, List<WorkoutTemplate>>
    {
        private readonly IMongoCollection<WorkoutTemplate> _collection = database.GetCollection<WorkoutTemplate>("workout_templates");

        public async Task<List<WorkoutTemplate>> Handle(GetWorkoutTemplatesQuery request, CancellationToken cancellationToken)
        {
            return await _collection.Find(x => x.UserId == request.UserId).ToListAsync(cancellationToken);
        }
    }
}
