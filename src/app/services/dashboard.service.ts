import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

import {
  IEmployee,
  IEmployeeShift,
  IEmployeeShiftsByDate,
  IEmployeeWithShifts
} from '../constants/employees.constants';
import { EmployeesService } from './employees.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly msToHourMultiplier = 3600000;

  constructor(
    private employeesService: EmployeesService
  ) {}

  public getEmployees(): Observable<IEmployeeWithShifts[]> {
    return this.employeesService.getEmployees()
      .pipe(
        switchMap((employees: IEmployee[]) => forkJoin(
          employees.map((employee: IEmployee) => this.employeesService.getEmployeeShifts(employee.id).pipe(
            map(shifts => {
              const sortedShifts = shifts.sort((shift1, shift2) =>
                new Date(shift1.clockIn).getTime() - new Date(shift2.clockIn).getTime())

              const shiftsByDate = this.getShiftsByDate(sortedShifts);

              return {
                ...employee,
                shifts: shiftsByDate,
                ...this.calculateTotals(employee, shiftsByDate)
              }
            })
          ))
        ))
      )
  }

  private getShiftsByDate(shifts: IEmployeeShift[]) {
    const shiftsByDateMap: IEmployeeShiftsByDate = {};
    let timeForNextDay = 0;

    for (const shift of shifts) {
      const adjustedShift = {...shift};
      const startClock = new Date(shift.clockIn);
      const endClock = new Date(shift.clockOut);

      const date = startClock.toLocaleDateString();
      if (!shiftsByDateMap[date]) {
        shiftsByDateMap[date] = [];
      }

      timeForNextDay = 0;
      let addShift = null;

      if (startClock.toDateString() != endClock.toDateString()) {
        const nextDayStartTime = new Date(endClock.toDateString());
        timeForNextDay = (endClock.getTime() - nextDayStartTime.getTime()) / this.msToHourMultiplier;

        addShift = {...shift};
        addShift.clockIn = nextDayStartTime.toString();

        const nextDate = endClock.toLocaleDateString();
        if (!shiftsByDateMap[nextDate]) {
          shiftsByDateMap[nextDate] = [addShift];
        }

        let newEndClock = new Date(startClock);
        newEndClock.setHours(23, 59, 59, 999);
        adjustedShift.clockOut = newEndClock.toString();
      }

      shiftsByDateMap[date].push(adjustedShift);
    }
    return shiftsByDateMap;
  }

  private calculateTotals(employee: IEmployee, shiftsByDate: IEmployeeShiftsByDate) {
    const total = {
      clocked: 0,
      paidAmount: 0,
      paidRegularTimeAmount: 0,
      overtimePaidAmount: 0
    }

    Object.keys(shiftsByDate).forEach(date => {
      let clockedHours = 0;
      let regularClockedTime = 0;
      let overtimeClockedTime = 0;

      shiftsByDate[date]
        .map((shift) => {
          const startClock = new Date(shift.clockIn);
          const endClock = new Date(shift.clockOut);
          clockedHours += (endClock.getTime() - startClock.getTime()) / this.msToHourMultiplier;
        });

      if (clockedHours > 8) {
        regularClockedTime += 8;
        overtimeClockedTime += clockedHours - 8;
      } else {
        regularClockedTime += clockedHours;
      }

      total.clocked += clockedHours;
      total.paidRegularTimeAmount += regularClockedTime * employee.hourlyRate;
      total.overtimePaidAmount += overtimeClockedTime * employee.overtimeHourlyRate;
    });

    total.paidAmount = total.paidRegularTimeAmount + total.overtimePaidAmount;
    return total
  }
}
