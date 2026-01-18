using Carter;
using MediatR;
using FitTracker.ApiService.Modules.Workouts.Models;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Workouts.Features.GetWorkoutSessions;

public static class GetWorkoutSessions
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/workouts/sessions", async (ISender sender) =>
            {
                var query = new GetWorkoutSessionsQuery("user-1"); // MVP User
                var result = await sender.Send(query);
                return Results.Ok(result);
            })
            .WithTags("Workouts");
        }
    }

    public record GetWorkoutSessionsQuery(string UserId) : IRequest<List<WorkoutSession>>;

    public class Handler(IMongoDatabase database) : IRequestHandler<GetWorkoutSessionsQuery, List<WorkoutSession>>
    {
        private readonly IMongoCollection<WorkoutSession> _collection = database.GetCollection<WorkoutSession>("workout_sessions");

        public async Task<List<WorkoutSession>> Handle(GetWorkoutSessionsQuery request, CancellationToken cancellationToken)
        {
            // Return sessions sorted by Date descending (newest first)
            return await _collection.Find(x => x.UserId == request.UserId)
                .SortByDescending(x => x.Date)
                .ToListAsync(cancellationToken);
        }
    }
}
