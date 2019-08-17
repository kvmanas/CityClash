import { error } from 'util';
import { Injectable } from '@angular/core';
import { Web3Model } from '../../Models/web3.model';
import { GameService } from '../Game/game.service';
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
        console.log(web3.utils.fromAscii(name));
        console.log(web3.utils.fromAscii(imageHash));

        await this.Game.web3data.gameinstance.methods
          .AddBuilding(web3.utils.fromAscii(name), '0x' + imageHash)
          .send({
            from: this.Game.web3data.account,
            gas: 6000000
          });
        console.log(imageHash);
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
}
