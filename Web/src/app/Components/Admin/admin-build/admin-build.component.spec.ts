import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildComponent } from './admin-build.component';

describe('AdminBuildComponent', () => {
  let component: AdminBuildComponent;
  let fixture: ComponentFixture<AdminBuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
