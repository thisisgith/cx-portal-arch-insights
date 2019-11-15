import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashRiskGridComponent } from './crash-risk-grid.component';

describe('CrashRiskGridComponent', () => {
  let component: CrashRiskGridComponent;
  let fixture: ComponentFixture<CrashRiskGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrashRiskGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashRiskGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
