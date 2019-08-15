import { Injectable } from '@angular/core';
import { Web3Service } from '../Web3/web3.service';
import { Web3Model } from '../../Models/web3.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public web3data: Web3Model;
  constructor(private web3service: Web3Service) {
    web3service.Web3Details$.subscribe(data => {
      this.web3data = data;
    });
  }
  public GemBalance = (address: string) => {
    return new Promise<number>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetPlayerGems(address)
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
  public tokenBalance = (address: string) => {
    return new Promise<number>((resolve, reject) => {
      this.web3data.tokenInstance.methods
        .balanceOf(address)
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
  public ApproveToken = (amount: number) => {
    return new Promise((resolve, reject) => {
      this.web3data.tokenInstance.methods
        .approve(this.web3data.gameinstance._address, amount)
        .send({
          from: this.web3data.account,
          gas: 6000000
        })
        .then(t => resolve(t))
        .catch(e => reject(e));
    });
  };
}
