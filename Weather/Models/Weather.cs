using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Weather.Models
{
    public class WeatherData
    {
        [FromForm(Name="file")]
        public IFormFile file { get; set; }
    }
}
