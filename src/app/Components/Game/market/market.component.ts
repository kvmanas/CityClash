import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/Services/Game/game.service';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { UserModel, SellOrders } from 'src/app/Models/game.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
declare let web3: any;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  @ViewChild('AlertMain', { static: false })
  private AlertMain: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  @ViewChild('AlertDelete', { static: false })
  private AlertDelete: SwalComponent;
  userDt: UserModel;
  sellOrders: SellOrders[];
  playerOrders: SellOrders[];
  FilledOrders: SellOrders[];
  TownBasicPrice: number;
  constructor(
    private gameService: GameService,
    private web3service: Web3Service
  ) {
    gameService.UserDetails$.subscribe(data => {
      if (this.gameService.web3data.gameinstance) {
        this.userDt = data;
        this.RefreshData();
      }
    });
  }

  ngOnInit() {}
  RefreshData = async () => {
    this.TownBasicPrice = await this.gameService.BasicPrice();
    const OrderList: [][] = (await this.gameService.GetSellOrders()) as [][];
    let AllOrders: SellOrders[] = [];
    for (let i = 0; i < OrderList[0].length; i++) {
      AllOrders.push({
        Town: OrderList[0][i],
        Seller: OrderList[1][i],
        Buyer: null,
        TownIndex: OrderList[2][i],
        SellPrice: web3.utils.fromWei(OrderList[3][i], 'ether'),
        SellIndex: OrderList[4][i]
      });
    }
    let j = 0;
    let k = 0;
    this.sellOrders = [];
    this.playerOrders = [];
    for (let i = 0; i < AllOrders.length; i++) {
      if (AllOrders[i].Seller === this.gameService.web3data.account) {
        this.playerOrders[j] = AllOrders[i];
        j++;
      } else {
        this.sellOrders[k] = AllOrders[i];
        k++;
      }
    }
    const Filled = await this.gameService.GetFilledOrders();
    this.FilledOrders = [];
    for (let i = 0; i < Filled[0].length; i++) {
      this.FilledOrders.push({
        Town: Filled[0][i],
        Seller: Filled[1][i],
        Buyer: Filled[2][i],
        TownIndex: null,
        SellPrice: web3.utils.fromWei(Filled[3][i], 'ether'),
        SellIndex: Filled[4][i]
      });
    }
  };
  BuyTown = async index => {
    const RequiredGem =
      (this.userDt._Towns.length *
        Math.pow(this.TownBasicPrice, this.userDt._Towns.length)) /
      2;
    this.AlertMain.title = 'Buy Town';
    this.AlertMain.html = `Requires ${RequiredGem / 100} CCG and ${
      this.sellOrders[index].SellPrice
    } ETH`;
    this.AlertMain.focusConfirm = false;
    this.AlertMain.confirmButtonText = 'Proceed';
    this.AlertMain.preConfirm = () => {
      return new Promise(resolve => {
        if (RequiredGem > this.userDt._GemsCount) {
          this.AlertMain.nativeSwal.showValidationMessage(
            'Insufficient Gems, Deposite Gem to continue'
          );
          resolve(false);
        } else {
          this.gameService
            .BuyVillage(
              this.sellOrders[index].SellIndex,
              this.sellOrders[index].SellPrice
            )
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
        this.AlertSuccess.text = 'Town Transferred Successfully';
        this.RefreshData();
        this.AlertSuccess.show();
      } else {
        this.AlertError.text = result.value[1];
        this.AlertError.show();
      }
    }
  };
  CancelOrder = async index => {
    this.AlertDelete.text = `Cancelling Order ${this.playerOrders[index].Town} !!`;
    this.AlertDelete.preConfirm = () => {
      return new Promise(resolve => {
        this.gameService
          .cancelOrder(this.playerOrders[index].SellIndex)
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            this.AlertMain.nativeSwal.showValidationMessage(
              'Something Went Wrong!!'
            );
            resolve(false);
          });
      });
    };
    const result = await this.AlertDelete.show();
    if (result.value) {
      this.AlertSuccess.text = 'Order Cancelled Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    }
  };
}
