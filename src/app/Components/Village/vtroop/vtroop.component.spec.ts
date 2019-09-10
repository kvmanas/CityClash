import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VtroopComponent } from './vtroop.component';

describe('VtroopComponent', () => {
  let component: VtroopComponent;
  let fixture: ComponentFixture<VtroopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VtroopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VtroopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
