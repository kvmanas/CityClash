import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTroopAddDetailsComponent } from './admin-troop-add-details.component';

describe('AdminTroopAddDetailsComponent', () => {
  let component: AdminTroopAddDetailsComponent;
  let fixture: ComponentFixture<AdminTroopAddDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTroopAddDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTroopAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
