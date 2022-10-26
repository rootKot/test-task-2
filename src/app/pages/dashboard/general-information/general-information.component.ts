import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IEmployeeWithShifts } from '../../../constants/employees.constants';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInformationComponent implements OnInit {

  @Input() public set employees(value: IEmployeeWithShifts[]) {
    this._employees = value;

    value.map(employee => {
      this.totalClockedTime += employee.clocked;
      this.totalPaidForRegularTime += employee.paidRegularTimeAmount;
      this.totalPaidForOvertime += employee.overtimePaidAmount;
    })
  }

  public get employees(): IEmployeeWithShifts[] {
    return this._employees;
  }

  public totalClockedTime: number = 0;
  public totalPaidForRegularTime: number = 0;
  public totalPaidForOvertime: number = 0;

  private _employees: IEmployeeWithShifts[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
