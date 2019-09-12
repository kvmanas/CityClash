import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Web3Service } from '../../../Services/Web3/web3.service';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
/**
 * Main UI component
 * loggin to access Game
 */
export class MainComponent implements OnInit {
  constructor(private web3service: Web3Service, private route: Router) {}
  @ViewChild('loginSuccess', { static: false })
  private SuccessAlert: SwalComponent;
  @ViewChild('loginError', { static: false })
  private ErrorAlert: SwalComponent;
  async ngOnInit() {
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged === 'true') {
      this.route.navigateByUrl('/Game');
    }
  }
  login = async () => {
    this.web3service
      .web3login()
      .then(() => {
        this.SuccessAlert.show();
        this.route.navigateByUrl('/Game');
      })
      .catch(e => {
        this.ErrorAlert.text = e;
        this.ErrorAlert.show();
      });
  };
}
