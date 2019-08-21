import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTroopComponent } from './admin-troop.component';

describe('AdminTroopComponent', () => {
  let component: AdminTroopComponent;
  let fixture: ComponentFixture<AdminTroopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTroopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTroopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
