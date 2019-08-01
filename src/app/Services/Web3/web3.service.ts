import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Web3Model } from '../../Model/web3.model';
declare let require: any;

const Web3 = require('web3');
declare let window: any;
declare let ethereum: any;
declare let web3: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  constructor() {}
  public Web3Details$: BehaviorSubject<Web3Model> = new BehaviorSubject<
    Web3Model
  >({
    account: 'User not Logged in',
    network: null
  });
  RefreshedAccount = interval(1000);
  public async web3login() {
    // check dapp browser
    if (window.ethereum || window.web3) {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
        } catch (error) {
          // User denied account access...
          console.log(error);
        }
      }
      //Legacy dapp browsers...
      else {
        window.web3 = new Web3(web3.currentProvider);
        // // Acccounts always exposed
        // web3.eth.sendTransaction({
        //   /* ... */
        // });
      }
      this.RefreshedAccount.subscribe(async () => {
        let Account = await this.GetAccount();
        const Network = await this.GetNetwork();
        console.log('Network id', Network);
        if (Account == null) {
          Account = 'User not Logged in';
        }
        this.Web3Details$.next({
          account: Account,
          network: Network
        });
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }
  private async GetAccount(): Promise<string> {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          reject('There was an error fetching your accounts.');
        }

        // Get the initial account balance so it can be displayed.
        if (accs.length === 0) {
          reject(
            "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
          );
        } else {
          resolve(accs[0]);
        }
      });
    });
  }
  private GetNetwork(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.web3.eth.net.getId((err, netId) => {
        if (err) {
          reject('Something Went Wrong, while getting network ID ');
        }
        switch (netId) {
          case 1:
            resolve('Main');
            break;
          case 3:
            resolve('Ropsten');
            break;
          case 42:
            resolve('Kovan');
            break;
          case 4:
            resolve('Rinkeby');
            break;
          default:
            resolve(null);
        }
      });
    });
  }
}
