using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Weather.Models;

namespace Weather.Controllers
{
  // [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class WeatherForecastController : ControllerBase
  {
    private static IEnumerable<WeatherForecast> weatherForecasts = new WeatherForecast[0];
    private WeatherCsvParser csvParser = new WeatherCsvParser();
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
      if(WeatherForecastController.weatherForecasts.Count() != 0)
        return WeatherForecastController.weatherForecasts;

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
    public Microsoft.AspNetCore.Mvc.IActionResult Post([FromForm] WeatherData weatherData)
    {
      try
      {
        this.validateWeatherData(weatherData);
        this.persistContent(weatherData.file);
        return Ok(WeatherForecastController.weatherForecasts.Count());
      }
      catch (InvalidDataException e)
      {
        return Problem(e.Message, null, 415, null, null);
      }
      catch (FormatException e)
      {
        return Problem(e.Message, null, 422, null, null);
      }

    }
    private void persistContent(IFormFile file)
    {
      weatherForecasts = this.csvParser.parseWeatherCsv(file);
    }
  }
}
