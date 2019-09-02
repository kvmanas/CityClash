import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/Models/game.model';
import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmain',
  templateUrl: './gmain.component.html',
  styleUrls: ['./gmain.component.scss']
})
export class GmainComponent implements OnInit {
  @ViewChild('AlertMain', { static: false })
  private AlertMain: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  @ViewChild('AlertDelete', { static: false })
  private AlertDelete: SwalComponent;
  userDt: UserModel;
  TownBasicPrice: number;
  constructor(
    private gameService: GameService,
    private web3service: Web3Service,
    private router: Router
  ) {
    gameService.UserDetails$.subscribe(data => {
      this.userDt = data;
    });
    web3service.Web3Details$.subscribe(data => {
      if (data.gameinstance) {
        this.RefreshData();
      }
    });
  }
  RefreshData = async () => {
    this.TownBasicPrice = await this.gameService.BasicPrice();
  };
  ngOnInit() {}
  CreateVillage = async () => {
    const RequiredGem =
      this.userDt._Towns.length *
      Math.pow(this.TownBasicPrice, this.userDt._Towns.length);
    this.AlertMain.title = 'Create New Town';
    this.AlertMain.html = `Requires ${RequiredGem / 100} CCG`;
    this.AlertMain.focusConfirm = false;
    this.AlertMain.confirmButtonText = 'Proceed';
    this.AlertMain.preConfirm = () => {
      return new Promise(resolve => {
        if (RequiredGem > this.userDt._GemsCount) {
          resolve([false, 'Insufficient Gems, Deposite Gem to continue']);
        } else {
          this.gameService
            .NewVillage()
            .then(() => {
              resolve([true]);
            })
            .catch(() => {
              resolve([false, 'Something Went Wrong!!']);
            });
        }
      });
    };
    const result = await this.AlertMain.show();
    if (result.value) {
      if (result.value[0]) {
        this.AlertSuccess.text = 'Town Created Successfully';
        this.RefreshData();
        this.AlertSuccess.show();
      } else {
        this.AlertError.text = result.value[1];
        this.AlertError.show();
      }
    }
  };
  DeposieGem = async () => {
    this.AlertMain.title = 'Deposite Gem';
    this.AlertMain.html = `<input type="number" id="gem-amount" placeholder="Gem Amount (CCG)" class="swal2-input">`;
    this.AlertMain.focusConfirm = false;
    this.AlertMain.confirmButtonText = 'Deposite';
    this.AlertMain.preConfirm = () => {
      return new Promise(resolve => {
        const GemAmount = (document.getElementById(
          'gem-amount'
        ) as HTMLInputElement).value;
        if (GemAmount === null || GemAmount === '' || +GemAmount <= 0) {
          this.AlertMain.nativeSwal.showValidationMessage('Invalid Amount');
          resolve(false);
        } else {
          this.gameService
            .GemDeposite(+GemAmount * 100)
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              this.AlertMain.nativeSwal.showValidationMessage(
                'Something Went Wrong'
              );
              resolve(false);
            });
        }
      });
    };
    const result = await this.AlertMain.show();
    if (result.value) {
      this.AlertSuccess.text = 'Gem Deposited Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    }
  };
  DeleteTown = async index => {
    const TownAddress = this.userDt._Towns[index];
    this.AlertDelete.text = `Deleting Town ${TownAddress} !!`;
    this.AlertDelete.preConfirm = () => {
      return new Promise(resolve => {
        this.gameService.DeleteTown(TownAddress, index, err => {
          if (err) {
            this.AlertDelete.nativeSwal.showValidationMessage(
              'Something Went Wrong'
            );
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    };
    const result = await this.AlertDelete.show();
    if (result.value) {
      this.AlertSuccess.text = 'Town Deleted Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    }
  };
  SellVillage = async index => {
    const TownAddress = this.userDt._Towns[index];
    this.AlertMain.title = `Sell Your Village (ID: ${index})`;
    this.AlertMain.html = `Sell Price in ETH <input type="number" id="eth-amount" placeholder="Ether Amount" class="swal2-input">`;
    this.AlertMain.focusConfirm = false;
    this.AlertMain.confirmButtonText = 'Sell';
    this.AlertMain.preConfirm = () => {
      return new Promise(resolve => {
        const EthAmount = (document.getElementById(
          'eth-amount'
        ) as HTMLInputElement).value;
        if (EthAmount === null || EthAmount === '' || +EthAmount <= 0) {
          this.AlertMain.nativeSwal.showValidationMessage('Invalid Amount');
          resolve(false);
        } else {
          this.gameService
            .SellVillage(TownAddress, index, +EthAmount)
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              this.AlertMain.nativeSwal.showValidationMessage(
                'Something Went Wrong'
              );
              resolve(false);
            });
        }
      });
    };
    const result = await this.AlertMain.show();
    if (result.value) {
      this.AlertSuccess.text = 'Sell Order Created..';
      this.RefreshData();
      this.AlertSuccess.show();
    }
  };
  viewVillage = index => {
    const TownAddress = this.userDt._Towns[index];
    this.router.navigate(['/Village', TownAddress]);
  };
}
