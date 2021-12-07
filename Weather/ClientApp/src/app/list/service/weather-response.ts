import { ListViewQueryDescriptor } from '../descriptors/list-view-query-descriptor';
import { WeatherForecast } from '../weather-forecast';


export type WeatherResponse = {
  listViewDescriptor: ListViewQueryDescriptor & { pagination: { availablePages: number; }; };
  weatherData: Array<WeatherForecast>;
};
