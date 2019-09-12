import { TroopModel, TroopDetailsModel } from './../../../Models/troop.model';
import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { VillageService } from 'src/app/Services/Village/village.service';
import { GameService } from 'src/app/Services/Game/game.service';
import { Subscription } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TroopQueueModel } from 'src/app/Models/village.model';

/**
 * Village Troop Component
 * Showing Village Troops and Troop status
 * option to train troops
 */
@Component({
  selector: 'app-vtroop',
  templateUrl: './vtroop.component.html',
  styleUrls: ['./vtroop.component.scss']
})
export class VtroopComponent implements OnInit, OnDestroy {
  @ViewChild('AlertMain', { static: false })
  private AlertMain: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  VillageSub: Subscription;
  isFirst = true;
  Elixr: number;
  Gold: number;
  TimeS: number;
  Troops: Array<TroopModel> = [];
  currentSatus: Array<string> = [];
  TroopDetails: Array<TroopDetailsModel> = [];
  TroopQueue: TroopQueueModel[] = [];
  QueueDetails: Array<TroopModel> = [];
  constructor(
    private villageService: VillageService,
    private gameService: GameService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.VillageSub = this.villageService.Village$.subscribe(data => {
      if (data.address) {
        this.TimeS = Math.floor(Date.now() / 1000);
        const TimeDiff = Math.floor(Date.now() / 1000) - data.data.TimeStamp;
        this.Elixr = +data.data.Elixr + data.data.ElixrRate * TimeDiff;
        this.Gold = +data.data.Gold + data.data.GoldRate * TimeDiff;
        if (this.isFirst) {
          this.RefreshData();
          this.isFirst = false;
        }
      }
    });
  }
  ngOnDestroy() {
    this.VillageSub.unsubscribe();
  }
  RefreshData = async () => {
    const TroopQueue = await this.villageService.GetTroopQueue();
    const troops = await this.gameService.GetTroops();
    const troopsids = troops.map(a => a.id);
    this.QueueDetails = TroopQueue.map(a => {
      return troops[troopsids.indexOf(a.ID)];
    });

    for (let i = 0; i < troops.length; i++) {
      this.currentSatus[i] = await this.villageService.CurrentTroopStatus(
        troops[i].id
      );

      this.TroopDetails[i] = await this.gameService.GetTroopDetails(
        troops[i].id
      );
    }
    this.Troops = troops;
    this.TroopQueue = TroopQueue;
  };
  TrainTroop = async index => {
    const dialogRef = this.dialog.open(VtrainDialogComponent, {
      width: '250px',
      data: [index, this.TroopDetails[index]]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined' && result.count && result.count > 0) {
        const ReGold =
          result.count * +this.TroopDetails[result.index]._RequiredGold;
        const ReElixr =
          result.count * +this.TroopDetails[result.index]._RequiredElixr;
        const ReGem =
          result.count * +this.TroopDetails[result.index]._RequiredGem;
        const Gems = this.gameService.UserDetails$.value._GemsCount;
        if (ReGold > this.Elixr || ReElixr > this.Gold || ReGem > Gems) {
          this.AlertError.text = 'Not Enough Resource to Train';
          this.AlertError.show();
        } else {
          this.villageService
            .TrainTroops(this.Troops[result.index].id, result.count)
            .then(() => {
              this.AlertSuccess.text = 'Success';
              this.RefreshData();
              this.AlertSuccess.show();
            })
            .catch(() => {
              this.AlertError.text = 'Something Went Wrong';
              this.RefreshData();
              this.AlertError.show();
            });
        }
      }
    });
  };
}

@Component({
  selector: 'app-vtraindialog',
  templateUrl: 'vtraindialog.html'
})
export class VtrainDialogComponent {
  count = 0;
  Gold = 0;
  Elixr = 0;
  Gem = 0;
  Attack = 0;
  Defence = 0;
  Steal = 0;
  Time = 0;
  constructor(
    public dialogRef: MatDialogRef<VtrainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
  dataChanged(e) {
    this.Attack = this.count * +this.data[1]._Attack;
    this.Defence = this.count * +this.data[1]._Defence;
    this.Steal = this.count * +this.data[1]._Steal;
    this.Gold = this.count * +this.data[1]._RequiredGold;
    this.Elixr = this.count * +this.data[1]._RequiredElixr;
    this.Gem = this.count * +this.data[1]._RequiredGem;
    this.Time = this.count * +this.data[1]._Time;
  }
  onTrain() {
    this.dialogRef.close({ count: this.count, index: this.data[0] });
  }
}
