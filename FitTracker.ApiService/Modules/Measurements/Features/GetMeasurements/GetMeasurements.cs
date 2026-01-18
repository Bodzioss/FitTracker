using Carter;
using MediatR;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Measurements.Features.GetMeasurements;

public static class GetMeasurements
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/measurements", async (ISender sender) =>
            {
                var result = await sender.Send(new GetMeasurementsQuery("user-1")); // MVP User
                return Results.Ok(result);
            })
            .WithTags("Measurements");
        }
    }

    public record GetMeasurementsQuery(string UserId) : IRequest<List<Measurement>>;

    public class GetMeasurementsHandler(IMongoDatabase database) : IRequestHandler<GetMeasurementsQuery, List<Measurement>>
    {
        private readonly IMongoCollection<Measurement> _collection = database.GetCollection<Measurement>("measurements");

        public async Task<List<Measurement>> Handle(GetMeasurementsQuery request, CancellationToken cancellationToken)
        {
            return await _collection.Find(x => x.UserId == request.UserId)
                .SortByDescending(x => x.Date)
                .ToListAsync(cancellationToken);
        }
    }
}
