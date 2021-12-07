import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../weather-forecast';
import { WeatherService } from './weather-service';

// TODO: create a simple cache, when uploading a new csv clear it
@Injectable()
export class HttpWeatherService implements WeatherService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  public getWeatherListView(): Observable<Array<WeatherForecast>> {
    return this.http.get<WeatherForecast[]>(this.baseUrl + 'weatherforecast')
  }
}