var builder = DistributedApplication.CreateBuilder(args);

var mongo = builder.AddMongoDB("mongo")
    .WithDataVolume("fit-tracker-data") // Persist data between restarts
    .WithMongoExpress(); 
var db = mongo.AddDatabase("FitTracker");

var apiService = builder.AddProject<Projects.FitTracker_ApiService>("apiservice")
    .WithReference(db)
    .WithHttpHealthCheck("/health");

builder.AddNpmApp("webapp", "../fit-tracker-web")
    .WithReference(apiService)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
