import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminrouterComponent } from './adminrouter.component';

describe('AdminrouterComponent', () => {
  let component: AdminrouterComponent;
  let fixture: ComponentFixture<AdminrouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminrouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminrouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
