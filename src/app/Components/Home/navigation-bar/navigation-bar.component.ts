import { Component, OnInit, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  @Input()
  ContentType: number;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private web3service: Web3Service,
    private route: Router
  ) {}

  logOut = async () => {
    this.web3service.web3logout();
    console.log('LogOut Button Pressed');
    this.route.navigateByUrl('/Home');
  };
  ngOnInit() {}
}