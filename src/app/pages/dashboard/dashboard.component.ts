import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { forkJoin, map, mapTo, Subject, switchMap, takeUntil } from 'rxjs';
import {
  IEmployee,
  IEmployeeShift,
  IEmployeeShiftsByDate,
  IEmployeeWithShifts
} from '../../constants/employees.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  public employees: IEmployeeWithShifts[] = [];
  private unsubscriber$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees() {
    this.dashboardService.getEmployees()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((employees: IEmployeeWithShifts[]) => {
        this.employees = employees;
        console.log(employees)
        this.cdRef.detectChanges();
      })
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
