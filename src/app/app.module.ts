import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './Modules/angular-material/angular-material.module';
import { HomeComponent } from './Components/home/home.component';
import { NavigationBarComponent } from './Components/navigation-bar/navigation-bar.component';
import { BackgroundComponent } from './Components/background/background.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationBarComponent,
    BackgroundComponent
  ],
  imports: [BrowserModule, AppRoutingModule, AngularMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
