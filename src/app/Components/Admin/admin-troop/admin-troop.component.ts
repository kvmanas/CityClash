import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/Services/Admin/admin.service';
import { TroopModel, TroopDetailsModel } from 'src/app/Models/troop.model';
import { AdminTroopViewDetailsComponent } from '../admin-troop-view-details/admin-troop-view-details.component';
import { AdminTroopAddDetailsComponent } from '../admin-troop-add-details/admin-troop-add-details.component';

export interface TroopDtModel {
  id: string;
  data: TroopDetailsModel;
}
@Component({
  selector: 'app-admin-troop',
  templateUrl: './admin-troop.component.html',
  styleUrls: ['./admin-troop.component.scss']
})
export class AdminTroopComponent implements OnInit {
  @ViewChild('addTroop', { static: false })
  private addTroop: SwalComponent;
  @ViewChild('AlertError', { static: false })
  private AlertError: SwalComponent;
  @ViewChild('AlertSuccess', { static: false })
  private AlertSuccess: SwalComponent;
  @ViewChild('deleteTroop', { static: false })
  private deleteTroop: SwalComponent;
  troops: Array<TroopModel>;

  constructor(private adminService: AdminService, private dialog: MatDialog) {}

  ngOnInit() {
    this.RefreshData();
  }
  RefreshData = async () => {
    this.troops = await this.adminService.Game.GetTroops();
  };
  AddTroop = async () => {
    this.addTroop.title = 'Add Troop';
    this.addTroop.html = `<input id="add-name" placeholder="Troop Name" class="swal2-input">
    Troop Image: <input id="add-file" type = "file" class="swal2-input" > `;
    this.addTroop.focusConfirm = false;
    this.addTroop.preConfirm = () => {
      return new Promise(resolve => {
        const TroopName = (document.getElementById(
          'add-name'
        ) as HTMLInputElement).value;
        const TroopFile = (document.getElementById(
          'add-file'
        ) as HTMLInputElement).files[0];
        if (TroopName === null || TroopName === '') {
          this.addTroop.nativeSwal.showValidationMessage('Invalid Troop Name');
          resolve(false);
        }
        if (
          typeof TroopFile === 'undefined' ||
          !TroopFile.name.match(/.(jpg|jpeg|png)$/i)
        ) {
          this.addTroop.nativeSwal.showValidationMessage('Invalid Troop Image');
          resolve(false);
        }
        this.adminService.AddTroop(TroopName, TroopFile, err => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    };
    const result = await this.addTroop.show();
    if (result.value) {
      this.AlertSuccess.text = 'Troop Added Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    } else {
      this.AlertError.text = 'Something Went Wrong';
      this.AlertError.show();
    }
  };
  DeleteTroop = async (index: number) => {
    this.deleteTroop.text = 'Deleting ' + this.troops[index].name + ' ..!!';
    this.deleteTroop.preConfirm = () => {
      return new Promise(resolve => {
        this.adminService.DeleteTroop(this.troops[index].id, err => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    };
    const result = await this.deleteTroop.show();
    if (result.value) {
      this.AlertSuccess.text = 'Troop Deleted Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    } else {
      this.AlertError.text = 'Something Went Wrong';
      this.AlertError.show();
    }
  };
  async viewDetails(index: string) {
    const Details: TroopDetailsModel = await this.adminService.Game.GetTroopDetails(
      this.troops[index].id
    );
    this.dialog.open(AdminTroopViewDetailsComponent, {
      width: '80%',
      data: { index, troops: this.troops, details: Details }
    });
  }
  AddDetails(index: string): void {
    const AddUpDialog = this.dialog.open(AdminTroopAddDetailsComponent, {
      width: '80%',
      data: { index, troops: this.troops }
    });
    AddUpDialog.afterClosed().subscribe((result: TroopDtModel) => {
      if (typeof result !== 'undefined') {
        this.adminService
          .AddTroopDetails(result.id, result.data)
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
