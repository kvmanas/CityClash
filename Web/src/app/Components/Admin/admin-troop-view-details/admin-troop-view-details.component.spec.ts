import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTroopViewDetailsComponent } from './admin-troop-view-details.component';

describe('AdminTroopViewDetailsComponent', () => {
  let component: AdminTroopViewDetailsComponent;
  let fixture: ComponentFixture<AdminTroopViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTroopViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTroopViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
