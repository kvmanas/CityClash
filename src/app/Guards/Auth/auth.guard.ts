import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
//import { AuthService } from '../../Services/Auth/auth.service';
// import { Web3Model } from '../../Models/web3.model';
// import { Web3Service } from '../../Services/Web3/web3.service';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private route: Router) {}
  canActivate(): boolean {
    // return this.web3service.Web3Details$.pipe(
    //   map(
    //     (n): boolean => {
    //       if (n.account) {
    //         return true;
    //       }
    //       return false;
    //     }
    //   )
    // );
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged === 'true') {
      return true;
    }
    this.route.navigateByUrl('/Home');
  }
}
