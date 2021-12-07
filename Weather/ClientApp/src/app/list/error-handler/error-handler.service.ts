import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPaths } from 'src/api-authorization/api-authorization.constants';

@Injectable()
export class WeatherErrorHandler {
  constructor (private activatedRoute: ActivatedRoute, private router: Router) { }
  public static isHttpError(error: Error): error is HttpErrorResponse {
    return error instanceof HttpErrorResponse;
  }

  public handleError(error: Error): void {
    if (WeatherErrorHandler.isHttpError(error))
      this.handleHttpError(error);
    else
      this.handleCustomError(error);
  }
  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.redirectToLogin();
        break;
      case 422:
        this.showErrorMessage('Could not process entity');
        break;
      default:
        this.showErrorMessage('Unknown error occurred: ' + error.message);
    }
  }
  private redirectToLogin(): void {
    this.router.navigate([ApplicationPaths.Login], {
      queryParams: { ReturnUrl: this.activatedRoute.snapshot.url }
    });
  }

  private handleCustomError(error: Error): void {
    this.showErrorMessage(error.message);
  }

  // TODO: toast message
  private showErrorMessage(message: string): void {
    console.error(message);
  }
}
