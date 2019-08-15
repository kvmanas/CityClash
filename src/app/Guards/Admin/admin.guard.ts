import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Web3Model } from '../../Models/web3.model';
import { Web3Service } from '../../Services/Web3/web3.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private route: Router, private web3service: Web3Service) {}
  private web3var: Web3Model;
  async canActivate(): Promise<boolean> {
    if (localStorage.getItem('isLogged') === 'true') {
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
      const GameOwner = await this.web3var.gameinstance.methods.owner().call();
      if (GameOwner === this.web3var.account) {
        return true;
      }
    }
    this.route.navigateByUrl('/Home');
  }
}
