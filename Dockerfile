# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["FitTracker.ApiService/FitTracker.ApiService.csproj", "FitTracker.ApiService/"]
COPY ["FitTracker.ServiceDefaults/FitTracker.ServiceDefaults.csproj", "FitTracker.ServiceDefaults/"]
RUN dotnet restore "FitTracker.ApiService/FitTracker.ApiService.csproj"

# Copy everything and build
COPY . .
WORKDIR "/src/FitTracker.ApiService"
RUN dotnet publish -c Release -o /app/publish

# Runtime stage - use bookworm (Debian) for better SSL support
FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim AS runtime
WORKDIR /app

# Install CA certificates for MongoDB Atlas SSL
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "FitTracker.ApiService.dll"]
