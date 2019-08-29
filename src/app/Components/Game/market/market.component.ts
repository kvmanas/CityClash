import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/Services/Game/game.service';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { UserModel, SellOrders } from 'src/app/Models/game.model';
declare let web3: any;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  userDt: UserModel;
  sellOrders: SellOrders[];
  playerOrders: SellOrders[];
  FilledOrders: SellOrders[];
  constructor(
    private gameService: GameService,
    private web3service: Web3Service
  ) {
    gameService.UserDetails$.subscribe(() => {
      if (this.gameService.web3data.gameinstance) {
        this.RefreshData();
      }
    });
  }

  ngOnInit() {}
  RefreshData = async () => {
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
    for (let i = 0; i < OrderList[0].length; i++) {
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
}
