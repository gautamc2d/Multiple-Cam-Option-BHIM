import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { LazyLoadModule } from './shared/lazy-load.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './shared/HttpConfigInterceptor';
import { AuthGuard } from './shared/Authentication/AuthGuard';
import { LoaderService } from './shared/Loader.service';
import { LoaderComponent } from './core/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner/typings/progress-spinner-module';
import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    LazyLoadModule,
    CoreModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [AuthGuard, LoaderService, { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
