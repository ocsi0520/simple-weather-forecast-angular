import { ListViewQueryDescriptor } from '../../descriptors/list-view-query-descriptor';
import { WeatherForecast } from '../../weather-forecast';
import { RawResponse } from '../raw-response';
import { WeatherResponse } from '../weather-response';

export class WeatherResponseMapper {
  public mapRawResponse(
    listViewDescriptor: ListViewQueryDescriptor | undefined,
    rawResponse: RawResponse
  ): WeatherResponse {
    if (!listViewDescriptor)
      return this.mapResponseWithDefaultDescriptor(rawResponse);
    else
      return this.mapResponseWithCustomDescriptor(listViewDescriptor, rawResponse);
  }
  private mapResponseWithDefaultDescriptor(weatherForecasts: Array<WeatherForecast>): WeatherResponse {
    const pageSize = 50;
    const currentPageIndex = 0;
    const availablePages = Math.ceil(weatherForecasts.length / pageSize);
    const dataInView = weatherForecasts.slice(0, 50);

    return {
      weatherData: dataInView,
      listViewDescriptor: {
        pagination: {
          availablePages,
          currentIndex: currentPageIndex,
          size: pageSize
        }
      }
    };
  }

  private mapResponseWithCustomDescriptor(
    listViewDescriptor: ListViewQueryDescriptor,
    weatherForecasts: Array<WeatherForecast>
  ): WeatherResponse {
    const isPaginationSet = listViewDescriptor.pagination !== null;
    if (isPaginationSet)
      return this.mapResponseWithPagination(listViewDescriptor, weatherForecasts);
    else
      return this.mapResponseWithoutPagination(weatherForecasts);
  }
  private mapResponseWithPagination(
    listViewDescriptor: ListViewQueryDescriptor,
    weatherForecasts: WeatherForecast[]
  ): WeatherResponse {
    const pagination = listViewDescriptor.pagination;
    const availablePages = Math.ceil(weatherForecasts.length / pagination.size);
    const offset = pagination.currentIndex * pagination.size;
    const dataInView = weatherForecasts.slice(offset, offset + pagination.size);
    return {
      listViewDescriptor: {
        pagination: {
          availablePages,
          ...pagination
        }
      },
      weatherData: dataInView
    };
  }

  private mapResponseWithoutPagination(weatherForecasts: WeatherForecast[]): WeatherResponse {
    return {
      listViewDescriptor: { pagination: null },
      weatherData: weatherForecasts
    };
  }
}
