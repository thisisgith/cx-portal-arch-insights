import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashedSystemsGridComponent } from './crashed-systems-grid.component';

describe('CrashedSystemsGridComponent', () => {
  let component: CrashedSystemsGridComponent;
  let fixture: ComponentFixture<CrashedSystemsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrashedSystemsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashedSystemsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
