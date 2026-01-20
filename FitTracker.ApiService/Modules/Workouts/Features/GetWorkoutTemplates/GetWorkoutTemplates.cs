using Carter;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Workouts.Features.GetWorkoutTemplates;

public static class GetWorkoutTemplates
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/workouts/templates", async (ISender sender) =>
            {
                var query = new GetWorkoutTemplatesQuery("user-1");
                var result = await sender.Send(query);
                return Results.Ok(result);
            })
            .WithTags("Workouts");
        }
    }

    public record GetWorkoutTemplatesQuery(string UserId) : IRequest<List<WorkoutTemplate>>;

    public class GetWorkoutTemplatesHandler(InMemoryDataStore store) : IRequestHandler<GetWorkoutTemplatesQuery, List<WorkoutTemplate>>
    {
        public Task<List<WorkoutTemplate>> Handle(GetWorkoutTemplatesQuery request, CancellationToken cancellationToken)
        {
            var templates = store.WorkoutTemplates.Where(x => x.UserId == request.UserId).ToList();
            return Task.FromResult(templates);
        }
    }
}
