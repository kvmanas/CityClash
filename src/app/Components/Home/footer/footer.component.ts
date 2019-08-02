import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  UserAddress: string;
  Network: string;
  constructor(private web3service: Web3Service) {}

  ngOnInit() {
    this.web3service.Web3Details$.subscribe((data: Web3Model) => {
      this.UserAddress = data.account;
      this.Network = data.network;
      if (!this.UserAddress) {
        this.UserAddress = 'User not Logged in';
      }
      if (!this.Network) {
        this.Network = 'User not connected';
      }
    });
  }
}