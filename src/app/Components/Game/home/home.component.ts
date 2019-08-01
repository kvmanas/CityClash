import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private web3service: Web3Service) {}
  ngOnInit() {}
  login = () => {
    this.web3service.web3login();
  };
}
