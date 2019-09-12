import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TroopModel, TroopDetailsModel } from 'src/app/Models/troop.model';

export interface DialogData {
  index: number;
  troops: Array<TroopModel>;
  details: TroopDetailsModel;
}
/**
 * Admin View Troop Training Detail Component
 * Showing Table of Training Detail
 */
@Component({
  selector: 'app-admin-troop-view-details',
  templateUrl: './admin-troop-view-details.component.html',
  styleUrls: ['./admin-troop-view-details.component.scss']
})
export class AdminTroopViewDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdminTroopViewDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {}
  onCancel(): void {
    this.dialogRef.close();
  }
}
