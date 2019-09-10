import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from 'src/app/Services/Game/game.service';
import { VillageData } from 'src/app/Models/village.model';

@Component({
  selector: 'app-vview',
  templateUrl: './vview.component.html',
  styleUrls: ['./vview.component.scss']
})
export class VviewComponent implements OnInit {
  towndt: VillageData = {
    Attack: 0,
    Defence: 0,
    Elixr: 0,
    ElixrRate: 0,
    Gold: 0,
    GoldRate: 0,
    Steal: 0,
    TimeStamp: 0
  };
  constructor(
    public dialogRef: MatDialogRef<VviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private gameService: GameService
  ) {}

  ngOnInit() {
    let Village = this.gameService.web3data.towninstance.clone();
    Village.options.address = this.data;
    Village.methods
      .UserDetails()
      .call()
      .then(d => {
        this.towndt = d;
      });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
