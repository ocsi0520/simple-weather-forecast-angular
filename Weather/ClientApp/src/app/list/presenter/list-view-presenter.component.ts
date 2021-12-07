import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherResponse } from '../service/weather-response';

@Component({
  selector: 'app-weather-list-view-presenter',
  templateUrl: './list-view-presenter.component.html',
})
export class WeatherListViewPresenter {
  @Input('listView') public listView: WeatherResponse;

  @Output('goToPage') public goToPageEmitter: EventEmitter<number> = new EventEmitter();

  @Output('changePageSize') public changePageSizeEmitter: EventEmitter<number> = new EventEmitter();
}
