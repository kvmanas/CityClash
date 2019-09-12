import { VillageService } from './../../../Services/Village/village.service';
import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';
import { map, switchMap, delay } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { VillageModel } from 'src/app/Models/village.model';
import { ActivatedRoute } from '@angular/router';

/**
 * Footer Component
 * Showing content according to url paths
 */

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() ContentType: number;
  VillageSub: Subscription;
  village: VillageModel = {
    address: null,
    data: {
      Attack: 0,
      Defence: 0,
      Elixr: 0,
      ElixrRate: 0,
      Gold: 0,
      GoldRate: 0,
      Steal: 0,
      TimeStamp: 0
    }
  };
  RefreshedDataSub: Subscription;
  Elixr: number;
  Gold: number;
  TimeDiff = 0;
  constructor(
    private web3service: Web3Service,
    private gameService: GameService,
    private villageService: VillageService,
    private activedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    if (this.ContentType === 4) {
      this.villageService.setVillage(this.activedRoute.snapshot.params.id);
      this.VillageSub = this.villageService.Village$.subscribe(async data => {
        if (data.address) {
          this.village = data;
          const TimeDiff =
            Math.floor(Date.now() / 1000) - this.village.data.TimeStamp;
          this.Elixr =
            +this.village.data.Elixr + this.village.data.ElixrRate * TimeDiff;
          this.Gold =
            +this.village.data.Gold + this.village.data.GoldRate * TimeDiff;
        }
      });
    }
    this.gameService.ObserveUserDetails();
  }
  ngOnDestroy() {
    this.gameService.UserSubscription.unsubscribe();
    if (this.ContentType === 4) {
      this.VillageSub.unsubscribe();
      this.villageService.VillageSubscription.unsubscribe();
    }
  }
}
