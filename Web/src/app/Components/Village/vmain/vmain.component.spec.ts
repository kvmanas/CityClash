import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmainComponent } from './vmain.component';

describe('VmainComponent', () => {
  let component: VmainComponent;
  let fixture: ComponentFixture<VmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
