using FluentValidation;
using Carter;
using FitTracker.ApiService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()  // For demo - allow all origins
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Domain Services
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddCarter();

// Database - InMemory for demo (Singleton to persist data during app lifetime)
builder.Services.AddSingleton<InMemoryDataStore>();

// ----------------------
// To switch to MongoDB locally, comment out InMemoryDataStore above and uncomment below:
// ----------------------
// using MongoDB.Driver;
// builder.Services.AddSingleton<IMongoClient>(sp =>
// {
//     var connectionString = builder.Configuration.GetConnectionString("FitTracker") ?? "mongodb://localhost:27017";
//     return new MongoClient(connectionString);
// });
// builder.Services.AddScoped<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase("FitTracker"));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();
app.UseCors(); // Enable CORS

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapDefaultEndpoints();

// Modules
app.MapCarter();

app.Run();
