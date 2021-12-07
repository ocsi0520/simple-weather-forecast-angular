import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListViewQueryDescriptor } from '../descriptors/list-view-query-descriptor';
import { WeatherForecast } from '../weather-forecast';
import { WeatherResponseMapper } from './response-mapper/response-mapper';
import { WeatherService } from './weather-service';
import { WeatherResponse } from "./weather-response";

// TODO: create a simple cache, when uploading a new csv clear it
@Injectable()
export class HttpWeatherService implements WeatherService {
  constructor (
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private responseMapper: WeatherResponseMapper
  ) { }
  public getWeatherListView(listViewDescriptor?: ListViewQueryDescriptor): Observable<WeatherResponse> {
    return this.http.get<WeatherForecast[]>(this.baseUrl + 'weatherforecast').pipe(
      map((weatherForecasts) => this.responseMapper.mapRawResponse(listViewDescriptor, weatherForecasts))
    );
  }
}