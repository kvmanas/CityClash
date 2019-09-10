import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VviewComponent } from './vview.component';

describe('VviewComponent', () => {
  let component: VviewComponent;
  let fixture: ComponentFixture<VviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
