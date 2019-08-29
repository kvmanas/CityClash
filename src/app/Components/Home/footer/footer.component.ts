import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Web3Model } from '../../../Models/web3.model';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() ContentType: number;
  constructor(
    private web3service: Web3Service,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.gameService.ObserveUserDetails();
  }
  ngOnDestroy() {
    this.gameService.UserSubscription.unsubscribe();
  }
}
