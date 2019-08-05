import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private web3service: Web3Service, private route: Router) {}

  async ngOnInit() {
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged === 'true') {
      this.route.navigateByUrl('/Game');
    }
  }
  login = async () => {
    await this.web3service.web3login();
    this.route.navigateByUrl('/Game');
  };
}
