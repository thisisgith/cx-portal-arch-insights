import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashHistoryDetailsComponent } from './crash-history-details.component';

describe('CrashHistoryDetailsComponent', () => {
  let component: CrashHistoryDetailsComponent;
  let fixture: ComponentFixture<CrashHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrashHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
