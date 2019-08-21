import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/Services/Admin/admin.service';
import { TroopModel } from 'src/app/Models/troop.model';

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
        this.adminService.AddBuilding(TroopName, TroopFile, err => {
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
      this.AlertSuccess.text = 'Building Added Successfully';
      this.RefreshData();
      this.AlertSuccess.show();
    } else {
      this.AlertError.text = 'Something Went Wrong';
      this.AlertError.show();
    }
  };
}
