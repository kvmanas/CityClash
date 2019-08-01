import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
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
  public address$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'User not Logged in'
  );
  public async web3login() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        const RefreshedAccount = interval(1000);
        RefreshedAccount.subscribe(async () => {
          let asd = await this.GetAccount();
          this.address$.next(asd);
        });
        // Acccounts now exposed
      } catch (error) {
        // User denied account access...
        console.log(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      const RefreshedAccount = interval(1000);
      RefreshedAccount.subscribe(async () => {
        let asd = await this.GetAccount();
        this.address$.next(asd);
      });
      // // Acccounts always exposed
      // web3.eth.sendTransaction({
      //   /* ... */
      // });
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }
  private async GetAccount() {
    return web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return 'null';
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn(
          "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
        );
        return 'null';
      } else {
        return accs[0];
      }
    });
  }
}
