import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildViewUpgradesComponent } from './admin-build-view-upgrades.component';

describe('AdminBuildViewUpgradesComponent', () => {
  let component: AdminBuildViewUpgradesComponent;
  let fixture: ComponentFixture<AdminBuildViewUpgradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBuildViewUpgradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildViewUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
