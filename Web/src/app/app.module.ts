import { AdminGuard } from './Guards/Admin/admin.guard';
import { GmainComponent } from './Components/Game/gmain/gmain.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminrouterComponent } from './Components/Admin/adminrouter/adminrouter.component';
import { AdminHomeComponent } from './Components/Admin/admin-home/admin-home.component';
import { AdminBuildComponent } from './Components/Admin/admin-build/admin-build.component';
import { AdminBuildViewUpgradesComponent } from './Components/Admin/admin-build-view-upgrades/admin-build-view-upgrades.component';
import { AdminBuildAddUpgradesComponent } from './Components/Admin/admin-build-add-upgrades/admin-build-add-upgrades.component';
import { AdminTroopAddDetailsComponent } from './Components/Admin/admin-troop-add-details/admin-troop-add-details.component';
import { AdminTroopViewDetailsComponent } from './Components/Admin/admin-troop-view-details/admin-troop-view-details.component';
import { AdminTroopComponent } from './Components/Admin/admin-troop/admin-troop.component';
import { MarketComponent } from './Components/Game/market/market.component';
import { VmainComponent } from './Components/Village/vmain/vmain.component';
import { VrouterComponent } from './Components/Village/vrouter/vrouter.component';
import {
  VtroopComponent,
  VtrainDialogComponent
} from './Components/Village/vtroop/vtroop.component';
import { VbattleComponent } from './Components/Village/vbattle/vbattle.component';
import { VviewComponent } from './Components/Village/vview/vview.component';

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
    AdminrouterComponent,
    AdminHomeComponent,
    AdminBuildComponent,
    AdminBuildViewUpgradesComponent,
    AdminBuildAddUpgradesComponent,
    AdminTroopAddDetailsComponent,
    AdminTroopViewDetailsComponent,
    AdminTroopComponent,
    MarketComponent,
    VmainComponent,
    VrouterComponent,
    VtroopComponent,
    VtrainDialogComponent,
    VbattleComponent,
    VviewComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SweetAlert2Module.forRoot(),
    HttpClientModule
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminBuildViewUpgradesComponent,
    AdminBuildAddUpgradesComponent,
    AdminTroopAddDetailsComponent,
    AdminTroopViewDetailsComponent,
    VtrainDialogComponent,
    VviewComponent
  ]
})
export class AppModule {}
