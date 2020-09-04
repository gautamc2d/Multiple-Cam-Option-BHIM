import { MatTableModule } from '@angular/material/table';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCrmComponent } from './dashboard-crm.component';

describe('DashboardCrmComponent', () => {
  let component: DashboardCrmComponent;
  let fixture: ComponentFixture<DashboardCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [MatTableModule],
      declarations: [ DashboardCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
