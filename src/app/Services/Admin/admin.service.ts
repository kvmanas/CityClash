import { error } from 'util';
import { Injectable } from '@angular/core';
import { Web3Model } from '../../Models/web3.model';
import { GameService } from '../Game/game.service';
import { BUpgradeModel } from 'src/app/Models/building.model';
import { resolve } from 'q';
import { TroopDetailsModel } from 'src/app/Models/troop.model';
declare let web3: any;
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
  public changeSellCommission = (amount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.Game.web3data.gameinstance.methods
          .changeSellCommission(amount)
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
  public changeBasicPrice = (amount: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(amount);

        await this.Game.web3data.gameinstance.methods
          .changeTownBasicPrice(amount)
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
  public AddBuilding = (
    name: string,
    file: File,
    callback: (error: boolean) => void
  ) => {
    const fileReader = new FileReader();
    fileReader.onload = async e => {
      const FileBuffer = Buffer.from(
        new Uint8Array(fileReader.result as ArrayBuffer)
      );
      try {
        const imageHash = await this.Game.UploadtoSwarm(FileBuffer);

        await this.Game.web3data.gameinstance.methods
          .AddBuilding(web3.utils.fromAscii(name), '0x' + imageHash)
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        callback(false);
      } catch {
        callback(true);
      }
    };
    fileReader.onerror = () => {
      callback(true);
    };
    fileReader.readAsArrayBuffer(file);
  };
  public DeleteBuilding = async (
    id: string,
    callback: (error: boolean) => void
  ) => {
    try {
      await this.Game.web3data.gameinstance.methods.DeleteBuilding(id).send({
        from: this.Game.web3data.account,
        gas: 6000000
      });
      callback(false);
    } catch {
      callback(true);
    }
  };
  public AddBuildUpgrade = (id: string, level: string, data: BUpgradeModel) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.Game.web3data.gameinstance.methods
          .ChangeBuildingUpgrade(id, level, ...Object.values(data))
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        resolve();
      } catch {
        reject();
      }
    });
  };
  public AddTroop = (
    name: string,
    file: File,
    callback: (error: boolean) => void
  ) => {
    const fileReader = new FileReader();
    fileReader.onload = async e => {
      const FileBuffer = Buffer.from(
        new Uint8Array(fileReader.result as ArrayBuffer)
      );
      try {
        const imageHash = await this.Game.UploadtoSwarm(FileBuffer);
        await this.Game.web3data.gameinstance.methods
          .AddTroops(web3.utils.fromAscii(name), '0x' + imageHash)
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        callback(false);
      } catch {
        callback(true);
      }
    };
    fileReader.onerror = () => {
      callback(true);
    };
    fileReader.readAsArrayBuffer(file);
  };
  public DeleteTroop = async (
    id: string,
    callback: (error: boolean) => void
  ) => {
    try {
      await this.Game.web3data.gameinstance.methods.DeleteTroops(id).send({
        from: this.Game.web3data.account,
        gas: 6000000
      });
      callback(false);
    } catch {
      callback(true);
    }
  };
  public AddTroopDetails = (id: string, data: TroopDetailsModel) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.Game.web3data.gameinstance.methods
          .ChangeTroopTrain(id, ...Object.values(data))
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        resolve();
      } catch {
        reject();
      }
    });
  };
}
