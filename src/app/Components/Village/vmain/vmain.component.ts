import { GameService } from './../../../Services/Game/game.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vmain',
  templateUrl: './vmain.component.html',
  styleUrls: ['./vmain.component.scss']
})
export class VmainComponent implements OnInit {
  village: string;
  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.village = this.activedRoute.snapshot.params.id;

    this.RefreshData();
  }
  RefreshData = async () => {};
}
