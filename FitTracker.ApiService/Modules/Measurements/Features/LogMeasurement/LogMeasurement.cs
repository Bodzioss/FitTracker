using Carter;
using FluentValidation;
using MediatR;
using FitTracker.ApiService.Infrastructure;

namespace FitTracker.ApiService.Modules.Measurements.Features.LogMeasurement;

public static class LogMeasurement
{
    public class Endpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/api/measurements", async (LogMeasurementRequest request, ISender sender) =>
            {
                var command = new LogMeasurementCommand("user-1", request);
                var id = await sender.Send(command);
                return Results.Created($"/api/measurements/{id}", new { Id = id });
            })
            .WithTags("Measurements");
        }
    }

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

    public record LogMeasurementCommand(string UserId, LogMeasurementRequest Data) : IRequest<string>;

    public class LogMeasurementValidator : AbstractValidator<LogMeasurementCommand>
    {
        public LogMeasurementValidator()
        {
            RuleFor(x => x.Data.Weight).GreaterThan(0);
            RuleFor(x => x.Data.Height).GreaterThan(0);
        }
    }

    public class LogMeasurementHandler(InMemoryDataStore store) : IRequestHandler<LogMeasurementCommand, string>
    {
        public Task<string> Handle(LogMeasurementCommand request, CancellationToken cancellationToken)
        {
            var entity = new Measurement
            {
                Id = Guid.NewGuid().ToString(),
                UserId = request.UserId,
                Date = request.Data.Date ?? DateTime.UtcNow,
                Weight = (decimal)request.Data.Weight,
                Height = (decimal)request.Data.Height,
                Chest = (decimal)request.Data.Chest,
                Waist = (decimal)request.Data.Waist,
                Hips = (decimal)request.Data.Hips,
                Bicep = (decimal)request.Data.Bicep,
                Thigh = (decimal)request.Data.Thigh,
                Calf = (decimal)request.Data.Calf
            };

            store.Measurements.Add(entity);
            return Task.FromResult(entity.Id);
        }
    }
}
