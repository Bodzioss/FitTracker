using Carter;
using FluentValidation;
using MediatR;
using MongoDB.Driver;

namespace FitTracker.ApiService.Modules.Measurements.Features.LogMeasurement;

public static class LogMeasurement
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/measurements", async (LogMeasurementRequest request, ISender sender) =>
            {
                var command = new LogMeasurementCommand("user-1", request); // Hardcoded User for MVP
                var id = await sender.Send(command);
                return Results.Created($"/api/measurements/{id}", new { Id = id });
            })
            .WithTags("Measurements");
        }
    }

    // DTO
    public record LogMeasurementRequest(
        double Weight,
        double Height,
        double Chest,
        double Waist,
        double Hips,
        double Bicep,
        double Thigh,
        double Calf,
        DateTime? Date);

    // Command
    public record LogMeasurementCommand(string UserId, LogMeasurementRequest Data) : IRequest<string>;

    // Validator
    public class LogMeasurementValidator : AbstractValidator<LogMeasurementCommand>
    {
        public LogMeasurementValidator()
        {
            RuleFor(x => x.Data.Weight).GreaterThan(0);
            RuleFor(x => x.Data.Height).GreaterThan(0);
        }
    }

    // Handler
    public class LogMeasurementHandler(IMongoDatabase database) : IRequestHandler<LogMeasurementCommand, string>
    {
        private readonly IMongoCollection<Measurement> _collection = database.GetCollection<Measurement>("measurements");

        public async Task<string> Handle(LogMeasurementCommand request, CancellationToken cancellationToken)
        {
            var entity = new Measurement
            {
                UserId = request.UserId,
                Date = request.Data.Date ?? DateTime.UtcNow,
                Weight = request.Data.Weight,
                Height = request.Data.Height,
                Chest = request.Data.Chest,
                Waist = request.Data.Waist,
                Hips = request.Data.Hips,
                Bicep = request.Data.Bicep,
                Thigh = request.Data.Thigh,
                Calf = request.Data.Calf
            };

            await _collection.InsertOneAsync(entity, cancellationToken: cancellationToken);
            return entity.Id;
        }
    }
}
