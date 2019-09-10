import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TroopModel } from 'src/app/Models/troop.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';

export interface DialogData {
  index: number;
  troops: Array<TroopModel>;
}
@Component({
  selector: 'app-admin-troop-add-details',
  templateUrl: './admin-troop-add-details.component.html',
  styleUrls: ['./admin-troop-add-details.component.scss']
})
export class AdminTroopAddDetailsComponent implements OnInit {
  TroopDtForm = new FormGroup(
    {
      _Defence: new FormControl(),
      _Attack: new FormControl(),
      _Steal: new FormControl(),
      _RequiredGold: new FormControl(),
      _RequiredElixr: new FormControl(),
      _RequiredGem: new FormControl(),
      _Time: new FormControl()
    },
    { validators: [Validators.required, Validators.min(0)] }
  );
  constructor(
    public dialogRef: MatDialogRef<AdminTroopAddDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.TroopDtForm.valid) {
      this.TroopDtForm.value._Time *= 60;
      this.TroopDtForm.value._RequiredGem *= 100;
      this.dialogRef.close({
        id: this.data.troops[this.data.index].id,
        data: this.TroopDtForm.value
      });
    }
  }
}
