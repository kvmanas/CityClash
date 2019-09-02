import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() ContentType: number;
  village: string;
  constructor(
    private web3service: Web3Service,
    private gameService: GameService,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.ContentType === 4) {
      this.village = this.activedRoute.snapshot.params.id;
    }
    this.gameService.ObserveUserDetails();
  }
  ngOnDestroy() {
    this.gameService.UserSubscription.unsubscribe();
  }
}
