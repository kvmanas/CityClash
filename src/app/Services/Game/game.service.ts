import { Injectable } from '@angular/core';
import { Web3Service } from '../Web3/web3.service';
import { Web3Model } from '../../Models/web3.model';
import { Bzz } from '@erebos/api-bzz-browser';
import { BuildingModel, BUpgradeModel } from 'src/app/Models/building.model';
import { resolve } from 'dns';
import { reject } from 'q';
import { TroopModel } from 'src/app/Models/troop.model';
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
    return new Promise<Array<BuildingModel>>((resolve, reject) => {
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
  public GetBuildingUpgrade = (id, level) => {
    return this.web3data.gameinstance.methods
      .GetBuildingUpgrades(id, level)
      .call();
  };
  public GetBuildingUpgrades = id => {
    return new Promise<Array<BUpgradeModel>>(async resolve => {
      const r = [];
      let i = 1;
      while (true) {
        let d: BUpgradeModel = await this.GetBuildingUpgrade(id, i);
        if (d._Time <= 0) {
          break;
        }
        r.push(d);
        i++;
      }
      resolve(r);
    });
  };
  public GetTroops = () => {
    return new Promise<Array<TroopModel>>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetTroops()
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
