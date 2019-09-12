import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouterComponent } from './grouter.component';

describe('GrouterComponent', () => {
  let component: GrouterComponent;
  let fixture: ComponentFixture<GrouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
