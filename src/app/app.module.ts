import { AdminGuard } from './Guards/Admin/admin.guard';
import { GmainComponent } from './Components/Game/gmain/gmain.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './Modules/angular-material/angular-material.module';
import { MainComponent } from './Components/Home/main/main.component';
import { NavigationBarComponent } from './Components/Home/navigation-bar/navigation-bar.component';
import { BackgroundComponent } from './Components/Home/background/background.component';
import { FooterComponent } from './Components/Home/footer/footer.component';
import { AuthGuard } from './Guards/Auth/auth.guard';
import { RouterComponent } from './Components/Home/router/router.component';
import { AboutComponent } from './Components/Home/about/about.component';
import { GrouterComponent } from './Components/Game/grouter/grouter.component';
import { BuildComponent } from './Components/Game/build/build.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminrouterComponent } from './Components/Admin/adminrouter/adminrouter.component';
import { AdminHomeComponent } from './Components/Admin/admin-home/admin-home.component';
import { AdminBuildComponent } from './Components/Admin/admin-build/admin-build.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavigationBarComponent,
    BackgroundComponent,
    FooterComponent,
    GmainComponent,
    RouterComponent,
    AboutComponent,
    GrouterComponent,
    BuildComponent,
    AdminrouterComponent,
    AdminHomeComponent,
    AdminBuildComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
