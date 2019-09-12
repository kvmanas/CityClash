import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AdminService } from '../../../Services/Admin/admin.service';
declare let web3: any;

/**
 * Admin Main Component
 * Showing Details of Game like contract address, ERC20 address, etc
 * option to deposite Gem to contract
 * option to change sell commission and Basic price
 */
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  CCAddress: string;
  CCGAddress: string;
  ContractownBalance: number;
  ContractBalance: number;
  AdminBalance: number;
  SellCommission: number;
  BasicPrice: number;
  amount = new FormControl('');
  sellCommission = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(100)
  ]);
  basicPrice = new FormControl('', [Validators.required, Validators.min(0)]);
  @ViewChild('depositeError', { static: false })
  private depositeError: SwalComponent;
  constructor(private Admin: AdminService) {}

  ngOnInit() {
    this.RefreshData();
  }
  RefreshData = async () => {
    this.CCAddress = this.Admin.Game.web3data.gameinstance._address;
    this.CCGAddress = this.Admin.Game.web3data.tokenInstance._address;
    this.ContractownBalance = await this.Admin.Game.GemBalance(this.CCAddress);
    this.ContractBalance = await this.Admin.Game.tokenBalance(this.CCAddress);
    this.AdminBalance = await this.Admin.Game.tokenBalance(
      this.Admin.Game.web3data.account
    );
    this.amount.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.AdminBalance / 100)
    ]);
    this.SellCommission = await this.Admin.Game.SellCommission();
    this.BasicPrice = await this.Admin.Game.BasicPrice();
  };
  DepositeGem = async () => {
    if (this.amount.valid) {
      const damount = Math.floor(this.amount.value * 100);
      try {
        await this.Admin.OwnerDeposite(damount);
        this.RefreshData();
      } catch {
        this.depositeError.text = 'Something Went Wrong';
        this.depositeError.show();
      }
    } else {
      this.depositeError.text = 'Invalid Amount';
      this.depositeError.show();
    }
  };
  ChangeSellCommission = async () => {
    if (this.sellCommission.valid) {
      try {
        await this.Admin.changeSellCommission(this.sellCommission.value);
        this.RefreshData();
      } catch {
        this.depositeError.text = 'Something Went Wrong';
        this.depositeError.show();
      }
    } else {
      this.depositeError.text = 'Invalid Commission';
      this.depositeError.show();
    }
  };
  ChangeBasicPrice = async () => {
    if (this.basicPrice.valid) {
      try {
        await this.Admin.changeBasicPrice(this.basicPrice.value * 100);
        this.RefreshData();
      } catch {
        this.depositeError.text = 'Something Went Wrong';
        this.depositeError.show();
      }
    } else {
      this.depositeError.text = 'Invalid Amount';
      this.depositeError.show();
    }
  };
}
