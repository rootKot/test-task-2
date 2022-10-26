export interface IEmployee {
  id: number;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeHourlyRate: number
}

export interface IEmployeeShift {
  employeeId: number;
  clockIn: string;
  clockOut: string;
}

export interface IEmployeeShiftsByDate {
  [date: string]: IEmployeeShift[]
}

export interface IEmployeeWithShifts extends IEmployee {
  shifts: IEmployeeShiftsByDate,
  clocked: number;
  paidAmount: number;
  paidRegularTimeAmount: number;
  overtimePaidAmount: number;
}

export enum EmployeeDataKeyEnum {
  Name = 'name',
  Email = 'email',
  Clocked = 'clocked',
  PaidRegularTimeAmount = 'paidRegularTimeAmount',
  OvertimePaidAmount = 'overtimePaidAmount',
}

export const EmployeeTableHeaderColumnNames = {
  [EmployeeDataKeyEnum.Name]: 'Name',
  [EmployeeDataKeyEnum.Email]: 'Email',
  [EmployeeDataKeyEnum.Clocked]: 'Total Clocked in a time',
  [EmployeeDataKeyEnum.PaidRegularTimeAmount]: 'The total amount paid for regular hours',
  [EmployeeDataKeyEnum.OvertimePaidAmount]: 'The total overtime amount paid for overtime hours'
}

export interface ITableColumns {
  columnDef: string;
  title: string;
  dataKey: string;
}

export interface IEmployeeTableConfig {
  displayColumns: EmployeeDataKeyEnum[];
  data: any[];
}
