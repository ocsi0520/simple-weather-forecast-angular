import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListViewQueryDescriptor } from '../descriptors/list-view-query-descriptor';
import { WeatherForecast } from '../weather-forecast';
import { WeatherResponseMapper } from './response-mapper/response-mapper';
import { WeatherService } from './weather-service';
import { WeatherResponse } from "./weather-response";

@Injectable()
export class HttpWeatherService implements WeatherService {
  private static cachedForeCasts: Array<WeatherForecast> | null = null;
  constructor (
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private responseMapper: WeatherResponseMapper
  ) { }
  public uploadWeatherList(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    // angular does not provide proper overload for post method
    // that's why we need responseType 'text', otherwise it will
    // automatically try to parse a json, which results in error
    return this.http.post<void>(this.getWeatherApiUrl(), formData, {
      responseType: 'text' as any
    }).pipe(tap(() => HttpWeatherService.cachedForeCasts = null));
  }
  public getWeatherListView(listViewDescriptor?: ListViewQueryDescriptor): Observable<WeatherResponse> {
    const mapperOperator =
      map((weatherForecasts: Array<WeatherForecast>) => this.responseMapper.mapRawResponse(listViewDescriptor, weatherForecasts));
    if (HttpWeatherService.cachedForeCasts !== null)
      return of(HttpWeatherService.cachedForeCasts).pipe(mapperOperator);
    else
      return this.http.get<WeatherForecast[]>(this.getWeatherApiUrl()).pipe(
        tap(rawResponse => HttpWeatherService.cachedForeCasts = rawResponse),
        mapperOperator
      );
  }

  private getWeatherApiUrl(): string {
    return this.baseUrl + 'weatherforecast';
  }
}