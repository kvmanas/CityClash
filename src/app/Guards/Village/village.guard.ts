import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { Web3Model } from 'src/app/Models/web3.model';

// Guard to check is address village or not
// if user is not admin redirect to /Home

@Injectable({
  providedIn: 'root'
})
export class VillageGuard implements CanActivate {
  constructor(private route: Router, private web3service: Web3Service) {}
  private web3var: Web3Model;
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (typeof this.web3service.AccountSubscription !== 'undefined') {
      if (this.web3service.AccountSubscription.closed) {
        localStorage.setItem('isLogged', 'false');
        await this.web3service.web3login();
      }
    } else {
      localStorage.setItem('isLogged', 'false');
      await this.web3service.web3login();
    }
    this.web3var = this.web3service.Web3Details$.value;
    // get village owner address
    const VillageOwner = await this.web3var.gameinstance.methods
      .GetVillageOwner(route.paramMap.get('id'))
      .call();
    // check village owner and logged account is same
    if (VillageOwner === this.web3var.account) {
      return true;
    }
    this.route.navigateByUrl('/Home');
  }
}
