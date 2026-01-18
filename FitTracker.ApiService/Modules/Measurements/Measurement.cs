using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FitTracker.ApiService.Modules.Measurements;

public class Measurement
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("userId")]
    public string UserId { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("weight")]
    public double Weight { get; set; } // kg

    [JsonPropertyName("height")]
    public double Height { get; set; } // cm

    // Circumferences (Obwody) in cm
    [JsonPropertyName("chest")]
    public double Chest { get; set; }

    [JsonPropertyName("waist")]
    public double Waist { get; set; } // Talia/Brzuch

    [JsonPropertyName("hips")]
    public double Hips { get; set; } // Biodra

    [JsonPropertyName("bicep")]
    public double Bicep { get; set; } // Ramię

    [JsonPropertyName("thigh")]
    public double Thigh { get; set; } // Udo

    [JsonPropertyName("calf")]
    public double Calf { get; set; } // Łydka
}
