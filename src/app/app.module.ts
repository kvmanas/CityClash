import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './Modules/angular-material/angular-material.module';
import { HomeComponent } from './Components/Game/home/home.component';
import { NavigationBarComponent } from './Components/Game/navigation-bar/navigation-bar.component';
import { BackgroundComponent } from './Components/Game/background/background.component';
import { FooterComponent } from './Components/Game/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationBarComponent,
    BackgroundComponent,
    FooterComponent
  ],
  imports: [BrowserModule, AppRoutingModule, AngularMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
