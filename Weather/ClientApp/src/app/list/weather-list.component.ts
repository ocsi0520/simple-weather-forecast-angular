import { Component, Inject, OnInit } from '@angular/core';
import { HttpWeatherService } from './service/http-weather-service';
import { WeatherService } from './service/weather-service';
import { ListViewQueryDescriptor } from './descriptors/list-view-query-descriptor';
import { WeatherResponse } from './service/weather-response';
import { WeatherResponseMapper } from './service/response-mapper/response-mapper';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  providers: [
    WeatherResponseMapper,
    { provide: 'WeatherService', useClass: HttpWeatherService }
  ]
})
export class WeatherList implements OnInit {
  private isLoading: boolean = true;
  private listViewQueryDescriptor: ListViewQueryDescriptor = {
    pagination: {
      currentIndex: 0,
      size: 50
    }
  };
  private listView: WeatherResponse | null = null;

  constructor (@Inject('WeatherService') private weatherService: WeatherService) { }

  public ngOnInit(): void {
    this.queryWeatherData();
  }

  private queryWeatherData(): void {
    this.isLoading = true;
    this.weatherService.getWeatherListView(this.listViewQueryDescriptor).subscribe(result => {
      this.listView = result;
      this.isLoading = false;
    }, error => this.handleError(error));
  }

  // TODO: handle error
  private handleError(_error: Error): void {
    this.isLoading = false;
  }

  public changePageSize(pageSize: number): void {
    this.listViewQueryDescriptor = {
      ...this.listViewQueryDescriptor,
      pagination: {
        currentIndex: 0,
        size: pageSize
      }
    };
    this.queryWeatherData();
  }
  public goToPage(pageIndex: number): void {
    this.listViewQueryDescriptor = {
      ...this.listViewQueryDescriptor,
      pagination: {
        ...this.listViewQueryDescriptor.pagination,
        currentIndex: pageIndex
      }
    };
    this.queryWeatherData();
  }
}


