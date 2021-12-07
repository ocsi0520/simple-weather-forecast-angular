import { Observable } from 'rxjs';
import { WeatherForecast } from '../weather-forecast';

export interface WeatherService {
  getWeatherListView(): Observable<Array<WeatherForecast>>;
}
