import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';

@Component({
  selector: 'app-adminrouter',
  templateUrl: './adminrouter.component.html',
  styleUrls: ['./adminrouter.component.scss']
})
export class AdminrouterComponent implements OnInit {
  constructor(private web3service: Web3Service) {}

  ngOnInit() {}
}
