import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    BookDetailComponent,
    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
