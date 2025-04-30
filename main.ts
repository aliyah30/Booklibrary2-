import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '.app.config';
import { AppComponent } from '.app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
