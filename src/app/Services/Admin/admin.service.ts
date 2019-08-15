import { Injectable } from '@angular/core';
import { Web3Model } from '../../Models/web3.model';
import { GameService } from '../Game/game.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(public Game: GameService) {}
  public OwnerDeposite = (amount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.Game.ApproveToken(amount);
        await this.Game.web3data.gameinstance.methods
          .depositGemOwner(amount)
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };
}
