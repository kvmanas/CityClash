import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbattleComponent } from './vbattle.component';

describe('VbattleComponent', () => {
  let component: VbattleComponent;
  let fixture: ComponentFixture<VbattleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbattleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
