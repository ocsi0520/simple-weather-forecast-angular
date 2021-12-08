using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Weather.Models;

namespace Weather.Controllers
{
  // [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class WeatherForecastController : ControllerBase
  {
    private static readonly string[] Summaries = new[]
    {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
      var rng = new Random();
      return Enumerable.Range(1, 5).Select(index => new WeatherForecast
      {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
      })
      .ToArray();
    }

    private void validateWeatherData(WeatherData weatherData)
    {
      bool isInvalidWeatherData =
        weatherData == null ||
          weatherData.file == null ||
          !(weatherData.file is IFormFile) ||
          weatherData.file.ContentType != "text/csv";
      if (isInvalidWeatherData)
        throw new InvalidDataException("File must have 'text/csv' content-type");
    }


    [HttpPost]
    [Consumes("multipart/form-data")]
    public Microsoft.AspNetCore.Mvc.ObjectResult Post([FromForm] WeatherData weatherData)
    {
      try {
        this.validateWeatherData(weatherData);
        return Ok(this.ReadAsList(weatherData.file));
      } catch (InvalidDataException e) {
        return Problem(e.Message, null, 415, null, null);
      }
    }
    private string ReadAsList(IFormFile file)
    {
      var result = new StringBuilder();
      using (var reader = new StreamReader(file.OpenReadStream()))
      {
        while (reader.Peek() >= 0)
          result.AppendLine(reader.ReadLine());
      }
      return result.ToString();
    }
  }
}
