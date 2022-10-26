import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  EmployeeDataKeyEnum,
  EmployeeTableHeaderColumnNames, IEmployee,
  ITableColumns
} from '../../../constants/employees.constants';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEditModalComponent } from './employee-edit-modal/employee-edit-modal.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent implements OnInit {
  @Input() public employees: any[] = [];

  public readonly employeeDataKeyEnum = EmployeeDataKeyEnum;
  public tableDisplayColumns: string[] = [];
  public selectedEmployees: {[key: number]: IEmployee} = {};

  private readonly tableColumns: EmployeeDataKeyEnum[] = [
    EmployeeDataKeyEnum.Name,
    EmployeeDataKeyEnum.Email,
    EmployeeDataKeyEnum.Clocked,
    EmployeeDataKeyEnum.PaidRegularTimeAmount,
    EmployeeDataKeyEnum.OvertimePaidAmount
  ];

  public get columns(): ITableColumns[] {
    return this.tableColumns.map((column: EmployeeDataKeyEnum) => {
      return {
        columnDef: column,
        title: EmployeeTableHeaderColumnNames[column],
        dataKey: column,
      }
    }) as ITableColumns[];
  }

  public get isSelectedAnyRow(): boolean {
    return !!Object.keys(this.selectedEmployees).length;
  }

  constructor(
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tableDisplayColumns = ['select', ...this.tableColumns];
  }

  public selectEmployee(employee: IEmployee): void {
    if (this.selectedEmployees[employee.id]) {
      delete this.selectedEmployees[employee.id];
    } else {
      this.selectedEmployees[employee.id] = employee;
    }
    console.log(this.selectedEmployees);
  }

  public edit(): void {
    this.matDialog.open(EmployeeEditModalComponent, {
      data: {
        employees: Object.values(this.selectedEmployees)
      }
    });
  }
}
