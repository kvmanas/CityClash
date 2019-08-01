import { Injectable } from '@angular/core';
import { Web3Model } from '../../Models/web3.model';
import { Web3Service } from '../Web3/web3.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUser = false;
  constructor(private web3service: Web3Service) {
    this.web3service.Web3Details$.subscribe((data: Web3Model) => {
      console.log('Auth service Subscribe', data.account);
      if (data.account) {
        this.isUser = true;
      }
    });
  }
  isActive = (): boolean => this.isUser;
}
