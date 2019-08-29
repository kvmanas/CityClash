import { AdminBuildComponent } from './Components/Admin/admin-build/admin-build.component';
import { AdminHomeComponent } from './Components/Admin/admin-home/admin-home.component';
import { AdminrouterComponent } from './Components/Admin/adminrouter/adminrouter.component';
import { AdminGuard } from './Guards/Admin/admin.guard';
import { MainComponent } from './Components/Home/main/main.component';
import { AboutComponent } from './Components/Home/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GmainComponent } from './Components/Game/gmain/gmain.component';
import { AuthGuard } from './Guards/Auth/auth.guard';
import { RouterComponent } from './Components/Home/router/router.component';
import { GrouterComponent } from './Components/Game/grouter/grouter.component';
import { BuildComponent } from './Components/Game/build/build.component';
import { AdminTroopComponent } from './Components/Admin/admin-troop/admin-troop.component';
import { MarketComponent } from './Components/Game/market/market.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/Home',
    pathMatch: 'full'
  },
  {
    path: 'Home',
    component: RouterComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'About',
        component: AboutComponent
      }
    ]
  },
  {
    path: 'Game',
    component: GrouterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GmainComponent
      },
      {
        path: 'Village',
        component: BuildComponent
      },
      {
        path: 'Market',
        component: MarketComponent
      }
    ]
  },
  {
    path: 'Admin',
    component: AdminrouterComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        component: AdminHomeComponent
      },
      {
        path: 'Buildings',
        component: AdminBuildComponent
      },
      {
        path: 'Troops',
        component: AdminTroopComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
