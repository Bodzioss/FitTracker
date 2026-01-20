using Carter;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Workouts.Features.GetWorkoutSessions;

public static class GetWorkoutSessions
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/workouts/sessions", async (ISender sender) =>
            {
                var query = new GetWorkoutSessionsQuery("user-1");
                var result = await sender.Send(query);
                return Results.Ok(result);
            })
            .WithTags("Workouts");
        }
    }

    public record GetWorkoutSessionsQuery(string UserId) : IRequest<List<WorkoutSession>>;

    public class Handler(InMemoryDataStore store) : IRequestHandler<GetWorkoutSessionsQuery, List<WorkoutSession>>
    {
        public Task<List<WorkoutSession>> Handle(GetWorkoutSessionsQuery request, CancellationToken cancellationToken)
        {
            var sessions = store.WorkoutSessions
                .Where(x => x.UserId == request.UserId)
                .OrderByDescending(x => x.Date)
                .ToList();
            return Task.FromResult(sessions);
        }
    }
}
