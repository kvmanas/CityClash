import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Model/web3.model';

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
    });
  }
}
