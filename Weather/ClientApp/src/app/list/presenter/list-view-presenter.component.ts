import { Component, Input } from '@angular/core';
import { WeatherForecast } from '../weather-forecast';

@Component({
  selector: 'app-weather-list-view-presenter',
  templateUrl: './list-view-presenter.component.html',
})
export class WeatherListViewPresenter {
  @Input('forecasts') public forecasts: Array<WeatherForecast>;
}
