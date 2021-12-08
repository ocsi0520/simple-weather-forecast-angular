using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;
using Weather;
using System.Collections.Generic;
using System.Linq;
using System;

class WeatherCsvParser
{
    public IEnumerable<WeatherForecast> parseWeatherCsv(IFormFile file)
    {
      var allStringRecords = this.readAllLines(file);
      return allStringRecords.Select(stringRecord => this.mapStringRecordToModel(stringRecord));
    }

    private IEnumerable<string> readAllLines(IFormFile file)
    {
      var stringRecords = new List<string>();
      using (var reader = new StreamReader(file.OpenReadStream()))
      {
        while (reader.Peek() >= 0)
          stringRecords.Add(reader.ReadLine());
      }
      return stringRecords;
    }
    
    private WeatherForecast mapStringRecordToModel(string stringRecord)
    {
        var parts = stringRecord.Split(',', System.StringSplitOptions.TrimEntries);
        if (parts.Length != 3)
          throw new FormatException("Wrongly formatted record: " + stringRecord);
        
        
        return new WeatherForecast{
          Date = Convert.ToDateTime(parts[0]),
          TemperatureC = Convert.ToInt32(parts[1]),
          Summary = parts[2]
        };
    }
}