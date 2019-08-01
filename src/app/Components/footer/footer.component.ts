import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../Services/Web3/web3.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  UserAddress: string;
  constructor(private web3service: Web3Service) {
    this.web3service.address$.subscribe(data => {
      this.UserAddress = data;
    });
  }

  ngOnInit() {}
}
