import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Guard to check is user loggin or not
// if user is not logged redirect to /Home
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private route: Router) {}
  canActivate(): boolean {
    // get isLogged variable from local storage
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged === 'true') {
      return true;
    }
    this.route.navigateByUrl('/Home');
  }
}
