import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpWeatherService } from './service/http-weather-service';
import { WeatherService } from './service/weather-service';
import { ListViewQueryDescriptor } from './descriptors/list-view-query-descriptor';
import { WeatherResponse } from './service/weather-response';
import { WeatherResponseMapper } from './service/response-mapper/response-mapper';
import { WeatherErrorHandler } from './error-handler/error-handler.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type KeyUpEvent = {
  target: HTMLInputElement;
};

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  providers: [
    WeatherErrorHandler,
    WeatherResponseMapper,
    { provide: 'WeatherService', useClass: HttpWeatherService }
  ]
})
export class WeatherList implements OnInit, OnDestroy {
  @ViewChild('search', { static: true }) public input: ElementRef;
  private searchSubscription: Subscription;
  public isLoading: boolean = true;
  private listViewQueryDescriptor: ListViewQueryDescriptor = {
    pagination: {
      currentIndex: 0,
      size: 50
    }
  };
  public listView: WeatherResponse | null = null;

  constructor (
    @Inject('WeatherService') private weatherService: WeatherService,
    private errorHandler: WeatherErrorHandler
  ) { }

  public ngOnInit(): void {
    this.queryWeatherData();
    this.subscribeToSearchInput();
  }

  private subscribeToSearchInput(): void {
    this.searchSubscription = fromEvent<KeyUpEvent>(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((KeyUpEvent) => {
        this.listViewQueryDescriptor.searchParam = KeyUpEvent.target.value;
        this.queryWeatherData();
      });
  }

  public ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  public queryWeatherData(): void {
    this.isLoading = true;
    this.weatherService.getWeatherListView(this.listViewQueryDescriptor).subscribe(result => {
      this.listView = result;
      this.isLoading = false;
    }, error => this.handleError(error));
  }
  private handleError(error: Error): void {
    this.errorHandler.handleError(error);
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


