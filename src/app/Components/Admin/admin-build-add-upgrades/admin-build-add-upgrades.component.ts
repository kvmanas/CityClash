import { error } from 'util';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuildingModel } from 'src/app/Models/building.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';

export interface DialogData {
  index: number;
  buildings: Array<BuildingModel>;
}

@Component({
  selector: 'app-admin-build-add-upgrades',
  templateUrl: './admin-build-add-upgrades.component.html',
  styleUrls: ['./admin-build-add-upgrades.component.scss']
})
export class AdminBuildAddUpgradesComponent implements OnInit {
  //buildingids: Array<string>;
  UpLevel = new FormControl('', [Validators.required]);
  BuildUpForm = new FormGroup(
    {
      _RequiredBuilding: new FormControl(),
      _RequiredLevel: new FormControl(),
      _RequiredGold: new FormControl(),
      _RequiredElixr: new FormControl(),
      _RequiredGem: new FormControl(),
      _GoldRate: new FormControl(),
      _ElixrRate: new FormControl(),
      _GemReward: new FormControl(),
      _Time: new FormControl()
    },
    { validators: [Validators.required, Validators.min(0)] }
  );
  constructor(
    public dialogRef: MatDialogRef<AdminBuildAddUpgradesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    //this.buildingids = data.buildings.map(a => a.id);
  }

  ngOnInit() {}
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.BuildUpForm.valid && this.UpLevel.valid) {
      this.BuildUpForm.value._Time *= 60;
      console.log(this.BuildUpForm.value);
      this.dialogRef.close({
        id: this.data.buildings[this.data.index].id,
        level: this.UpLevel.value,
        data: this.BuildUpForm.value
      });
    }
  }
}
