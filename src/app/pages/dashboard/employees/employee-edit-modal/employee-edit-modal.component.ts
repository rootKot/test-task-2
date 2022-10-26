import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { IEmployeeShift, IEmployeeWithShifts } from '../../../../constants/employees.constants';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-employee-edit-modal',
  templateUrl: './employee-edit-modal.component.html',
  styleUrls: ['./employee-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditModalComponent implements OnInit {
  public readonly displayedColumns = [
    'clockIn', 'clockOut'
  ]

  public selectedDate = new Date().toLocaleDateString();
  public form!: FormGroup;

  public get employeesFormArray(): FormArray {
    return this.form.controls['employeesFormArray'] as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {employees: IEmployeeWithShifts[]},
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  public selectDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.selectedDate = event.value.toLocaleDateString();
    }
  }

  public getShiftsDataSource(i: number) {
    const shiftsFormGroup = this.getShiftsFormGroup(i);
    if (!shiftsFormGroup.controls[this.selectedDate]) {
      return [];
    }
    return (shiftsFormGroup.controls[this.selectedDate] as FormArray).getRawValue();
  }


  public trackByEmployeeId(index: number, item: IEmployeeWithShifts): number {
    return item.id;
  }

  public trackByShift(index: number, item: IEmployeeWithShifts): number {
    return item.id;
  }

  public getControl(i: number, name: string): FormControl {
    return this.employeesFormArray.controls[i].get(name) as FormControl;
  }

  public getShiftsFormGroup(i: number): FormGroup {
    return this.employeesFormArray.controls[i].get('shifts') as FormGroup;
  }

  public getShiftFormGroup(i: number, shiftIndex: number): FormGroup {
    return (this.getShiftsFormGroup(i).controls[this.selectedDate] as FormArray).controls[shiftIndex] as FormGroup;
  }


  public save(): void {
    const data = this.form.getRawValue();
    console.log('data', data);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      employeesFormArray: this.formBuilder.array(
        this.data.employees.map((employee: IEmployeeWithShifts) => {
          const shiftsGroup = this.formBuilder.group({});

          Object.keys(employee.shifts).forEach((date: string) => {
            shiftsGroup.addControl(date, this.formBuilder.array(employee.shifts[date].map((shift: IEmployeeShift) => {
              return this.formBuilder.group({
                employeeId: [shift.employeeId],
                clockIn: [shift.clockIn, Validators.required],
                timeIn: [
                  new Date(shift.clockIn)
                  .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), Validators.required
                ],
                clockOut: [new Date(shift.clockOut), Validators.required],
                timeOut: [
                  new Date(shift.clockOut)
                  .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), Validators.required
                ],
              })
            })));
          })

          return this.formBuilder.group({
            name: [employee.name, Validators.required],
            email: [employee.email, Validators.required],
            hourlyRate: [employee.hourlyRate, [Validators.required, Validators.min(0)]],
            overtimeHourlyRate: [employee.overtimeHourlyRate, [Validators.required, Validators.min(0)]],
            shifts: shiftsGroup
          })
        })
      )
    });
  }

}
