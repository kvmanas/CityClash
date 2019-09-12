import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grouter',
  templateUrl: './grouter.component.html',
  styleUrls: ['./grouter.component.scss']
})
export class GrouterComponent implements OnInit {
  constructor(private web3service: Web3Service, private route: Router) {}

  ngOnInit() {
    if (typeof this.web3service.AccountSubscription !== 'undefined') {
      if (this.web3service.AccountSubscription.closed) {
        localStorage.setItem('isLogged', 'false');
        this.web3service.web3login();
      }
    } else {
      localStorage.setItem('isLogged', 'false');
      this.web3service.web3login();
    }
  }
}
