import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee, IEmployeeShift } from '../constants/employees.constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private readonly api!: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.api = environment.endpointApi;
  }

  public getEmployees(): Observable<IEmployee[]> {
    return this.httpClient.get<IEmployee[]>(`${this.api}/employees`);
  }

  public getEmployeeShifts(id: number): Observable<IEmployeeShift[]> {
    return this.httpClient.get<IEmployeeShift[]>(`${this.api}/employeeShifts?employeeId=${id}`);
  }
}
