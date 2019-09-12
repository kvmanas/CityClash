import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmainComponent } from './gmain.component';

describe('GmainComponent', () => {
  let component: GmainComponent;
  let fixture: ComponentFixture<GmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GmainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
