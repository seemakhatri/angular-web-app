import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../Services/employee.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface CalendarDate {
  day: number;
  isOtherMonth: boolean;
  isToday?: boolean;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  addForm!: FormGroup;
  headerTitle: string = 'Add Employee Details';
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  fromDateCalendar: CalendarDate[] = [];
  toDateCalendar: CalendarDate[] = [];
  fromDateCurrentMonth: Date = new Date();
  toDateCurrentMonth: Date = new Date();
  showFromDatePicker: boolean = false;
  showToDatePicker: boolean = false;

  constructor(private fb: FormBuilder,
     private employeeService: EmployeeService,
       private router: Router, 
       private toasterService: ToastrService) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['']
    });

    this.generateCalendar('fromDate', this.fromDateCurrentMonth);
    this.generateCalendar('toDate', this.toDateCurrentMonth);
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  onSave(): void {
    if (this.addForm.valid) {
      const employee = this.addForm.value;
      employee.fromDate = employee.fromDate ? new Date(employee.fromDate) : null;
  
      if (employee.toDate && employee.toDate !== 'No Date') {
        employee.toDate = new Date(employee.toDate);
      } else {
        employee.toDate = null;
      }
  
      this.employeeService.addEmployee(employee).subscribe(response => {
        this.toasterService.success('Employee Inserted successfully!', 'Success');
        console.log('Employee added successfully', response);
        this.addForm.reset();
        this.router.navigate(['/employees']);
      }, error => {
        this.toasterService.error('Error adding employee!', 'Error');
        console.error('Error adding employee', error);
      });
    } else {
      console.error('Form is not valid');
    }
  }
  
  

  toggleDatePicker(datePickerId: string): void {
    const datePicker = document.getElementById(datePickerId + 'Picker');
    if (datePicker) {
      datePicker.style.display = datePicker.style.display === 'block' ? 'none' : 'block';
    }
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#fromDatePicker') && !target.closest('#toDatePicker')) {
      this.showFromDatePicker = false;
      this.showToDatePicker = false;
    }
  }

  closeDatePicker(datePickerId: string): void {
    const datePicker = document.getElementById(datePickerId + 'Picker');
    if (datePicker) {
      datePicker.style.display = 'none';
    }
  }

  generateCalendar(datePickerId: string, month: Date): void {
    const calendar: CalendarDate[] = [];
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
    const prevMonthDays = firstDay.getDay();
    const totalDays = prevMonthDays + lastDay.getDate();
    const nextMonthDays = (totalDays % 7 === 0) ? 0 : 7 - (totalDays % 7);
  
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
  
    for (let i = 1 - prevMonthDays; i <= lastDay.getDate() + nextMonthDays; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      const isToday = date.getDate() === todayDate && date.getMonth() === todayMonth && date.getFullYear() === todayYear;
  
      calendar.push({
        day: date.getDate(),
        isOtherMonth: i < 1 || i > lastDay.getDate(),
        isToday: isToday
      });
    }
  
    if (datePickerId === 'fromDate') {
      this.fromDateCalendar = calendar;
    } else {
      this.toDateCalendar = calendar;
    }
  }
  

  prevMonth(datePickerId: string): void {
    if (datePickerId === 'fromDate') {
      this.fromDateCurrentMonth = new Date(this.fromDateCurrentMonth.setMonth(this.fromDateCurrentMonth.getMonth() - 1));
      this.generateCalendar('fromDate', this.fromDateCurrentMonth);
    } else {
      this.toDateCurrentMonth = new Date(this.toDateCurrentMonth.setMonth(this.toDateCurrentMonth.getMonth() - 1));
      this.generateCalendar('toDate', this.toDateCurrentMonth);
    }
  }

  nextMonth(datePickerId: string): void {
    if (datePickerId === 'fromDate') {
      this.fromDateCurrentMonth = new Date(this.fromDateCurrentMonth.setMonth(this.fromDateCurrentMonth.getMonth() + 1));
      this.generateCalendar('fromDate', this.fromDateCurrentMonth);
    } else {
      this.toDateCurrentMonth = new Date(this.toDateCurrentMonth.setMonth(this.toDateCurrentMonth.getMonth() + 1));
      this.generateCalendar('toDate', this.toDateCurrentMonth);
    }
  }

  setToday(datePickerId: string): void {
    const today = new Date().toLocaleDateString('en-CA');
    this.addForm.controls[datePickerId].setValue(today);
    this.closeDatePicker(datePickerId);
  }

  setNoDate(datePickerId: string): void {
    this.addForm.controls[datePickerId].setValue('No Date');
    this.closeDatePicker(datePickerId);
  }
  

  setNextMonday(datePickerId: string): void {
    const today = new Date();
    const nextMonday = new Date(today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7))).toLocaleDateString('en-CA');
    this.addForm.controls[datePickerId].setValue(nextMonday);
    this.closeDatePicker(datePickerId);
  }

  setNextTuesday(datePickerId: string): void {
    const today = new Date();
    const nextTuesday = new Date(today.setDate(today.getDate() + ((2 + 7 - today.getDay()) % 7 || 7))).toLocaleDateString('en-CA');
    this.addForm.controls[datePickerId].setValue(nextTuesday);
    this.closeDatePicker(datePickerId);
  }

  setAfterOneWeek(datePickerId: string): void {
    const today = new Date();
    const afterOneWeek = new Date(today.setDate(today.getDate() + 7)).toLocaleDateString('en-CA');
    this.addForm.controls[datePickerId].setValue(afterOneWeek);
    this.closeDatePicker(datePickerId);
  }

  selectDate(datePickerId: string, date: CalendarDate): void {
    if (!date.isOtherMonth) {
      const selectedDate = new Date(this.getDatePickerCurrentMonth(datePickerId).getFullYear(), this.getDatePickerCurrentMonth(datePickerId).getMonth(), date.day).toLocaleDateString('en-CA');
      this.addForm.controls[datePickerId].setValue(selectedDate);
    }
  }

  getDatePickerCurrentMonth(datePickerId: string): Date {
    return datePickerId === 'fromDate' ? this.fromDateCurrentMonth : this.toDateCurrentMonth;
  }

  cancelDate(datePickerId: string): void {
    this.addForm.controls[datePickerId].setValue('');
    this.closeDatePicker(datePickerId);
  }

  saveDate(datePickerId: string): void {
    const toDateValue = this.addForm.controls[datePickerId].value;
  
    if (toDateValue === 'No Date') {
      this.addForm.controls[datePickerId].setValue('');
    }
  
    this.closeDatePicker(datePickerId);
  }

  selectRole(role: string): void {
    this.addForm.controls['role'].setValue(role);
  }
}
