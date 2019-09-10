import { Subscription, iif } from 'rxjs';
import { VillageService } from './../../../Services/Village/village.service';
import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BuildingModel, BUpgradeModel } from 'src/app/Models/building.model';
import { CurrentBuildStatus } from 'src/app/Models/village.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-vmain',
  templateUrl: './vmain.component.html',
  styleUrls: ['./vmain.component.scss']
})
export class VmainComponent implements OnInit, OnDestroy {
  @ViewChild('AlertMain', { static: false })
  private AlertMain: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  village: string;
  VillageSub: Subscription;
  buildings: Array<BuildingModel> = [];
  nextUpdate: Array<BUpgradeModel> = [];
  currentSatus: Array<CurrentBuildStatus> = [];
  isFirst = true;
  Elixr: number;
  Gold: number;
  TimeS: number;
  constructor(
    private villageService: VillageService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.VillageSub = this.villageService.Village$.subscribe(data => {
      if (data.address) {
        this.village = data.address;
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
    const buildings = await this.gameService.GetBuildings();
    const buildingids = buildings.map(a => a.id);
    for (let i = 0; i < buildings.length; i++) {
      this.currentSatus[i] = await this.villageService.CurrentBuildingStatus(
        buildings[i].id
      );
      this.nextUpdate[i] = await this.gameService.GetBuildingUpgrade(
        buildings[i].id,
        +this.currentSatus[i]._Level + 1
      );
      this.nextUpdate[i]._RequiredBuilding = buildingids.indexOf(
        this.nextUpdate[i]._RequiredBuilding + ''
      );
    }
    this.buildings = buildings;
  };
  Upgrade = async index => {
    const Gems = this.gameService.UserDetails$.value._GemsCount;
    const bid = this.buildings[index].id;
    const blevel = +this.currentSatus[index]._Level + 1;
    if (
      this.nextUpdate[index]._RequiredElixr > this.Elixr ||
      this.nextUpdate[index]._RequiredGold > this.Gold ||
      this.nextUpdate[index]._RequiredGem > Gems
    ) {
      this.AlertError.text = 'Not Enough Resource to Upgrade';
      this.AlertError.show();
    } else {
      try {
        await this.villageService.UpgradeBuilding(bid, blevel);
        this.AlertSuccess.text = 'Building Upgraded Successfully';
        this.RefreshData();
        this.AlertSuccess.show();
      } catch {
        this.AlertError.text = 'Something Went Wrong';
        this.AlertError.show();
      }
    }
  };
}
