import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { VillageService } from 'src/app/Services/Village/village.service';
import { GameService } from 'src/app/Services/Game/game.service';
import { MatDialog } from '@angular/material/dialog';
import { VviewComponent } from '../vview/vview.component';

@Component({
  selector: 'app-vbattle',
  templateUrl: './vbattle.component.html',
  styleUrls: ['./vbattle.component.scss']
})
export class VbattleComponent implements OnInit {
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  Enemies: Array<string>;
  constructor(
    private villageService: VillageService,
    private gameService: GameService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.Enemies = await this.gameService.GetAllVillages();
  }
  VewTown = index => {
    this.dialog.open(VviewComponent, {
      width: '250px',
      data: this.Enemies[index]
    });
  };
  AttackTown = async index => {
    let EnemyBase = this.gameService.web3data.towninstance.clone();
    EnemyBase.options.address = this.Enemies[index];
    EnemyBase.events.Battle().on('data', e => {
      if (
        this.gameService.web3data.towninstance.options.address ==
        e.returnValues.attacker
      ) {
        if (e.returnValues.success) {
          this.AlertSuccess.text = `You Got ${e.returnValues.Gold} Gold and ${e.returnValues.Elixr} Elixr`;
          this.AlertSuccess.show();
        } else {
          this.AlertError.text = 'Enemy Defended';
          this.AlertError.show();
        }
      }
    });
    await this.villageService.AttackUser(this.Enemies[index]);
  };
}
