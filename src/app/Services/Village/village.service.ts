import { Web3Model } from 'src/app/Models/web3.model';
import { Injectable, Optional, Inject } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import {
  VillageModel,
  VillageData,
  CurrentBuildStatus,
  CurrentTroopStatus,
  TroopQueueModel
} from 'src/app/Models/village.model';
import { Web3Service } from '../Web3/web3.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VillageService {
  public towninstance: any;
  public Village$: BehaviorSubject<VillageModel> = new BehaviorSubject<
    VillageModel
  >({
    address: null,
    data: null
  });
  web3data: Web3Model;
  VillageSubscription: Subscription;
  private RefreshedUser = interval(1000).pipe(delay(500));
  constructor(private web3Service: Web3Service) {
    web3Service.Web3Details$.subscribe(data => {
      this.web3data = data;
      this.towninstance = data.towninstance;
    });
    this.towninstance = web3Service.Web3Details$.value.towninstance;
  }
  public setVillage = async (village: string) => {
    this.VillageSubscription = this.RefreshedUser.subscribe(async () => {
      if (this.web3data.account) {
        this.towninstance.options.address = village;
        const TownData = await this.VillageDetails();
        this.Village$.next({ address: village, data: TownData });
      }
    });
  };
  public VillageDetails = (): Promise<VillageData> => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .UserDetails()
        .call()
        .then(async d => {
          resolve(d);
        })
        .catch(e => reject(e));
    });
  };
  public CurrentBuildingStatus = (
    index: string
  ): Promise<CurrentBuildStatus> => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .GetUpgradeDetails(index)
        .call()
        .then(async d => {
          resolve(d);
        })
        .catch(e => reject(e));
    });
  };
  public UpgradeBuilding = (index, level) => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .UpgradeBuilding(index, level)
        .send({
          from: this.web3data.account,
          gas: 6000000
        })
        .then(t => resolve(t))
        .catch(e => reject(e));
    });
  };
  public CurrentTroopStatus = (index: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .GetTrainDetails(index)
        .call()
        .then(async d => {
          resolve(d);
        })
        .catch(e => reject(e));
    });
  };
  public TrainTroops = (index, count) => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .TrainTroops(index, count)
        .send({
          from: this.web3data.account,
          gas: 6000000
        })
        .then(t => resolve(t))
        .catch(e => reject(e));
    });
  };
  public GetTroopQueue = (): Promise<TroopQueueModel[]> => {
    return new Promise(async (resolve, reject) => {
      const completed = await this.towninstance.methods.CompletedQueue().call();
      const total = await this.towninstance.methods.TotalQueue().call();
      let Queue: TroopQueueModel[] = [];
      for (let i = completed; i < total; i++) {
        Queue.push(await this.towninstance.methods.TroopsQueue(i).call());
      }
      resolve(Queue);
    });
  };
  public AttackUser = enemy => {
    return new Promise((resolve, reject) => {
      this.towninstance.methods
        .AttackEnemy(enemy)
        .send({
          from: this.web3data.account,
          gas: 6000000
        })
        .then(t => resolve(t))
        .catch(e => reject(e));
    });
  };
}
