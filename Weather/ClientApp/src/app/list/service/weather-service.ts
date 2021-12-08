import { Observable } from 'rxjs';
import { ListViewQueryDescriptor } from '../descriptors/list-view-query-descriptor';
import { WeatherResponse } from './weather-response';

export interface WeatherService {
  getWeatherListView(listViewDescriptor?: ListViewQueryDescriptor): Observable<WeatherResponse>;
  uploadWeatherList(file: File): Observable<void>
}
