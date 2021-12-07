import { Component, Inject } from '@angular/core';
import { WeatherForecast } from './weather-forecast';
import { HttpWeatherService } from './service/http-weather-service';
import { WeatherService } from './service/weather-service';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  providers: [{provide: 'WeatherService', useClass: HttpWeatherService }]
})
export class WeatherList {
  public forecasts: WeatherForecast[];

  constructor(@Inject('WeatherService') private weatherService: WeatherService) {
    this.weatherService.getWeatherListView().subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}


