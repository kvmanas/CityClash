import { MainComponent } from './Components/Home/main/main.component';
import { AboutComponent } from './Components/Home/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GmainComponent } from './Components/Game/gmain/gmain.component';
import { AuthGuard } from './Guards/Auth/auth.guard';
import { RouterComponent } from './Components/Home/router/router.component';
import { GrouterComponent } from './Components/Game/grouter/grouter.component';
import { BuildComponent } from './Components/Game/build/build.component';
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
    path: 'Villages',
    component: GrouterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GmainComponent
      },
      {
        path: 'Build',
        component: BuildComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
