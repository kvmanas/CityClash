import { Injectable } from '@angular/core';
import { Web3Service } from '../Web3/web3.service';
import { Web3Model } from '../../Models/web3.model';
import { Bzz } from '@erebos/api-bzz-browser';
declare let web3: any;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public web3data: Web3Model;
  public bzz: Bzz;
  constructor(private web3service: Web3Service) {
    this.bzz = new Bzz({ url: 'https://swarm-gateways.net' });
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
  GetBuildings = () => {
    return new Promise<object>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetBuildings()
        .call()
        .then(d => {
          let a = [];
          for (let i = 0; i < d[0].length; i++) {
            a.push({
              id: d[0][i],
              name: web3.utils.toUtf8(d[1][i]),
              image: this.SwarmLink(d[2][i].substring(2))
            });
          }
          resolve(a);
        })
        .catch(e => reject(e));
    });
  };
  public SwarmLink = (hash: string): string => {
    return this.bzz.getDownloadURL(hash, {}, true);
  };
  public UploadtoSwarm = (file: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.bzz
        .upload(file)
        .then(hash => {
          resolve(hash);
        })
        .catch(() => reject());
    });
  };
}
