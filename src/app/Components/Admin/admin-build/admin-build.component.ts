import { map } from 'rxjs/operators';
import { AdminService } from './../../../Services/Admin/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AdminBuildViewUpgradesComponent } from '../admin-build-view-upgrades/admin-build-view-upgrades.component';
import { BuildingModel, BUpgradeModel } from 'src/app/Models/building.model';
import { AdminBuildAddUpgradesComponent } from '../admin-build-add-upgrades/admin-build-add-upgrades.component';

declare let window: any;

export interface UpGradeModel {
  id: string;
  level: string;
  data: BUpgradeModel;
}
/**
 * Admin Building Component
 * Showing all Building available in Game
 * option to add new building
 * option to delete Building
 * optiom to add upgrade to existing building
 */
@Component({
  selector: 'app-admin-build',
  templateUrl: './admin-build.component.html',
  styleUrls: ['./admin-build.component.scss']
})
export class AdminBuildComponent implements OnInit {
  @ViewChild('addBuilding', { static: false })
  private addBuilding: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  @ViewChild('deleteBuilding', { static: false })
  private deleteBuilding: SwalComponent;
  buildings: Array<BuildingModel>;

  constructor(private adminService: AdminService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.RefreshData();
  }

  RefreshData = async () => {
    this.buildings = await this.adminService.Game.GetBuildings();
  };

  AddBuilding = async () => {
    this.addBuilding.title = 'Add Building';
    this.addBuilding.html = `<input id="add-name" placeholder="Building Name" class="swal2-input">
    Building Image: <input id="add-file" type = "file" class="swal2-input" > `;
    this.addBuilding.focusConfirm = false;
    this.addBuilding.preConfirm = () => {
      return new Promise(resolve => {
        const BuildName = (document.getElementById(
          'add-name'
        ) as HTMLInputElement).value;
        const BuildFile = (document.getElementById(
          'add-file'
        ) as HTMLInputElement).files[0];
        if (BuildName === null || BuildName === '') {
          this.addBuilding.nativeSwal.showValidationMessage(
            'Invalid Building Name'
          );
          resolve(false);
        }
        if (
          typeof BuildFile === 'undefined' ||
          !BuildFile.name.match(/.(jpg|jpeg|png)$/i)
        ) {
          this.addBuilding.nativeSwal.showValidationMessage(
            'Invalid Building Image'
          );
          resolve(false);
        }
        this.adminService.AddBuilding(BuildName, BuildFile, err => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    };
    const result = await this.addBuilding.show();
    if (result.value) {
      this.AlertSuccess.text = 'Building Added Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    } else {
      this.AlertError.text = 'Something Went Wrong';
      this.AlertError.show();
    }
  };
  DeleteBuilding = async (index: number) => {
    this.deleteBuilding.text =
      'Deleting ' + this.buildings[index].name + ' ..!!';
    this.deleteBuilding.preConfirm = () => {
      return new Promise(resolve => {
        this.adminService.DeleteBuilding(this.buildings[index].id, err => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    };
    const result = await this.deleteBuilding.show();
    if (result.value) {
      this.AlertSuccess.text = 'Building Deleted Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    } else {
      this.AlertError.text = 'Something Went Wrong';
      this.AlertError.show();
    }
  };
  async viewUpgrades(index: string) {
    const Upgrades: BUpgradeModel[] = await this.adminService.Game.GetBuildingUpgrades(
      this.buildings[index].id
    );
    this.dialog.open(AdminBuildViewUpgradesComponent, {
      width: '80%',
      data: { index, buildings: this.buildings, Upgrades }
    });
  }
  AddUpgrade(index: string): void {
    const AddUpDialog = this.dialog.open(AdminBuildAddUpgradesComponent, {
      width: '80%',
      data: { index, buildings: this.buildings }
    });
    AddUpDialog.afterClosed().subscribe((result: UpGradeModel) => {
      if (typeof result !== 'undefined') {
        this.adminService
          .AddBuildUpgrade(result.id, result.level, result.data)
          .then(() => {
            this.AlertSuccess.text = 'Upgrades Added Successfully';
            this.RefreshData();
            this.AlertSuccess.show();
          })
          .catch(() => {
            this.AlertError.text = 'Something Went Wrong';
            this.AlertError.show();
          });
      }
    });
  }
}
