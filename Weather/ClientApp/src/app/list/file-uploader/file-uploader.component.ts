import { Component, Inject } from '@angular/core';
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

  constructor(@Inject('WeatherService') private weatherService: WeatherService) {}

  public uploadFile(event: UploadEvent): void {
    const file = event.target.files[0];
    this.weatherService.uploadWeatherList(file).subscribe(
      (response) => console.info(response),
      (error) => console.info('error', error)
    );
  }
}
