using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FitTracker.ApiService.Modules.Exercises;

public class Exercise
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("muscleGroup")]
    public string MuscleGroup { get; set; } = string.Empty; // e.g., "Chest", "Legs"

    [JsonPropertyName("description")]
    public string? Description { get; set; }
}
