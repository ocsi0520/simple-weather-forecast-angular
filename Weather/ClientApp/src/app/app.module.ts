import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { WeatherList } from './list/weather-list.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { FakeAuthorizeService } from 'src/api-authorization/fake-authorize.service';
import { WeatherListViewPresenter } from './list/presenter/list-view-presenter.component';
import { Paginator } from './paginator/paginator.component';
import { FileUploaderComponent } from './list/file-uploader/file-uploader.component';

// TODO: put WeatherList into its own module

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    WeatherList,
    WeatherListViewPresenter,
    Paginator,
    FileUploaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'list', component: WeatherList, canActivate: [AuthorizeGuard] },
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: AuthorizeService, useClass: FakeAuthorizeService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
