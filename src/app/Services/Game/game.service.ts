import { Injectable } from '@angular/core';
import { Web3Service } from '../Web3/web3.service';
import { Web3Model } from '../../Models/web3.model';
import { Bzz } from '@erebos/api-bzz-browser';
import { BuildingModel, BUpgradeModel } from 'src/app/Models/building.model';
import { TroopModel, TroopDetailsModel } from 'src/app/Models/troop.model';
import { interval, BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/Models/game.model';
import { delay } from 'rxjs/operators';
declare let web3: any;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public web3data: Web3Model;
  public bzz: Bzz;
  public UserDetails$: BehaviorSubject<UserModel> = new BehaviorSubject<
    UserModel
  >({
    _Towns: [],
    _GemsCount: 0,
    Owner: []
  });
  private RefreshedUser = interval(1000).pipe(delay(500));
  public UserSubscription: Subscription;
  constructor(private web3service: Web3Service) {
    this.bzz = new Bzz({ url: 'https://swarm-gateways.net' });
    web3service.Web3Details$.subscribe(data => {
      this.web3data = data;
    });
  }
  public ObserveUserDetails() {
    this.UserSubscription = this.RefreshedUser.subscribe(async () => {
      if (this.web3data.account) {
        this.UserDetails$.next(
          await this.GetPlayerDetails(this.web3data.account)
        );
      }
    });
  }
  public GetPlayerDetails = (player): Promise<UserModel> => {
    return new Promise((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetPlayerDetails(player)
        .call()
        .then(async d => {
          let a = [];
          for (let i = 0; i < d._Towns.length; i++) {
            const o = await this.VillageOwner(d._Towns[i]);
            a.push(o);
          }
          d.Owner = a;
          resolve(d);
        })
        .catch(e => reject(e));
    });
  };
  public NewVillage = () => {
    return new Promise((resolve, reject) => {
      this.web3data.gameinstance.methods
        .CreateVillage()
        .send({
          from: this.web3data.account,
          gas: 6000000
        })
        .then(t => resolve(t))
        .catch(e => reject(e));
    });
  };
  public GemDeposite = (amount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.ApproveToken(amount);
        await this.web3data.gameinstance.methods.depositGems(amount).send({
          from: this.web3data.account,
          gas: 6000000
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };
  public SellCommission = () => {
    return new Promise<number>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .SellCommission()
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
  public BasicPrice = () => {
    return new Promise<number>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .TownBasicPrice()
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
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
  public GetTroopDetails = id => {
    return new Promise<TroopDetailsModel>(async resolve => {
      const d = await this.web3data.gameinstance.methods
        .GetToopsDetails(id)
        .call();
      resolve(d);
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
  public DeleteTown = async (
    address: string,
    index: number,
    callback: (error: boolean) => void
  ) => {
    try {
      await this.web3data.gameinstance.methods
        .DestroyUserVillage(address, index)
        .send({
          from: this.web3data.account,
          gas: 6000000
        });
      callback(false);
    } catch {
      callback(true);
    }
  };
  public SellVillage = (Address: string, index: number, EthAmount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.web3data.gameinstance.methods
          .SellUserVillage(
            Address,
            web3.utils.toWei(String(EthAmount), 'ether'),
            index
          )
          .send({
            from: this.web3data.account,
            gas: 6000000
          });
        resolve();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };
  public VillageOwner = (address: string) => {
    return new Promise<number>((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetVillageOwner(address)
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
  public GetSellOrders = () => {
    return new Promise((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetAvailableSellOrders()
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
  public GetFilledOrders = () => {
    return new Promise((resolve, reject) => {
      this.web3data.gameinstance.methods
        .GetFilledSellOrders()
        .call()
        .then(d => resolve(d))
        .catch(e => reject(e));
    });
  };
}
