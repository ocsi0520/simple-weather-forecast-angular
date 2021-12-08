import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { WeatherErrorHandler } from '../error-handler/error-handler.service';
import { WeatherService } from '../service/weather-service';

type UploadEvent = {
  target: HTMLInputElement;
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {
  @Output('fileUploaded') fileUploadedEmitter: EventEmitter<void> = new EventEmitter();
  constructor(
    @Inject('WeatherService') private weatherService: WeatherService,
    private weatherErrorHandler: WeatherErrorHandler
  ) {}

  public uploadFile(event: UploadEvent): void {
    const file = event.target.files[0];
    if (!file) return;

    this.weatherService.uploadWeatherList(file).subscribe(
      () => this.fileUploadedEmitter.emit(),
      (error) => this.weatherErrorHandler.handleError(error)
    );
  }
}
