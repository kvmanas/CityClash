import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VrouterComponent } from './vrouter.component';

describe('VrouterComponent', () => {
  let component: VrouterComponent;
  let fixture: ComponentFixture<VrouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VrouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
