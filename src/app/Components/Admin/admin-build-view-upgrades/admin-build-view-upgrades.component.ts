import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuildingModel, BUpgradeModel } from 'src/app/Models/building.model';

export interface DialogData {
  index: number;
  buildings: Array<BuildingModel>;
  Upgrades: BUpgradeModel;
}

@Component({
  selector: 'app-admin-build-view-upgrades',
  templateUrl: './admin-build-view-upgrades.component.html',
  styleUrls: ['./admin-build-view-upgrades.component.scss']
})
export class AdminBuildViewUpgradesComponent implements OnInit {
  displayedColumns: string[] = [
    'Level',
    'RequiredBuilding',
    'RequiredResources',
    'Upgrades',
    'Time'
  ];
  buildingids: Array<string>;
  constructor(
    public dialogRef: MatDialogRef<AdminBuildViewUpgradesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.buildingids = data.buildings.map(a => a.id);
  }

  ngOnInit() {}
  onCancel(): void {
    this.dialogRef.close();
  }
  getBuildingName(id): string {
    const index = this.buildingids.indexOf(id);
    return this.data.buildings[index].name;
  }
}
