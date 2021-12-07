import { ListViewDescriptor } from '../descriptors/list-view-descriptor';
import { WeatherForecast } from '../weather-forecast';


export type WeatherResponse = {
  listViewDescriptor: ListViewDescriptor;
  weatherData: Array<WeatherForecast>;
};
