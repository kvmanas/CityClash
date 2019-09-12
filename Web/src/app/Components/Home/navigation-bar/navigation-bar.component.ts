import { VillageService } from './../../../Services/Village/village.service';
import { Component, OnInit, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Web3Service } from 'src/app/Services/Web3/web3.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Navigation Bar Component
 * Showing content according to url paths
 */
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  @Input()
  ContentType: number;
  village: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private web3service: Web3Service,
    private route: Router,
    private activedRoute: ActivatedRoute,
    private villageService: VillageService
  ) {}

  logOut = async () => {
    this.web3service.web3logout();
    console.log('LogOut Button Pressed');
    this.route.navigateByUrl('/Home');
  };
  async ngOnInit() {
    if (this.ContentType === 4) {
      this.village = this.activedRoute.snapshot.params.id;
    }
  }
}
