import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildAddUpgradesComponent } from './admin-build-add-upgrades.component';

describe('AdminBuildAddUpgradesComponent', () => {
  let component: AdminBuildAddUpgradesComponent;
  let fixture: ComponentFixture<AdminBuildAddUpgradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBuildAddUpgradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildAddUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
