import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../Services/employee.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Employee } from '../employee-list/employee-list.component';
import { ToastrService } from 'ngx-toastr';

interface CalendarDate {
  day: number;
  isOtherMonth: boolean;
  isToday?: boolean;
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  editForm!: FormGroup;
  headerTitle: string = 'Edit Employee Details';
  showDeleteIcon: boolean = true;
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  fromDateCalendar: CalendarDate[] = [];
  toDateCalendar: CalendarDate[] = [];
  fromDateCurrentMonth: Date = new Date();
  toDateCurrentMonth: Date = new Date();
  showFromDatePicker: boolean = false;
  showToDatePicker: boolean = false;
  employeeId: number = 0;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, 
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['']
    });

    this.generateCalendar('fromDate', this.fromDateCurrentMonth);
    this.generateCalendar('toDate', this.toDateCurrentMonth);
    this.loadEmployee(); 
  }



  loadEmployee(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        if (employee) {
          this.editForm.patchValue({
            name: employee.name,
            role: employee.role,
            fromDate: new Date(employee.fromDate).toLocaleDateString('en-CA'), 
            toDate: employee.toDate ? new Date(employee.toDate).toLocaleDateString('en-CA') : null
          });
        }
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
      }
    });
  }

  

  toggleDatePicker(datePickerId: string): void {
    const datePicker = document.getElementById(datePickerId + 'Picker');
    if (datePicker) {
      datePicker.style.display = datePicker.style.display === 'block' ? 'none' : 'block';
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedEmployee: Employee = {
        id: this.employeeId,
        name: this.editForm.value.name,
        role: this.editForm.value.role,
        fromDate: new Date(this.editForm.value.fromDate),
        toDate: this.editForm.value.toDate ? new Date(this.editForm.value.toDate) : undefined
      };

      this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next: () => {
          this.toasterService.success('Employee updated successfully!', 'Success');
          console.log('Employee updated successfully.');
          this.editForm.reset();
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.toasterService.error('Error updating employee!', 'Error');
          console.error('Error updating employee:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  deleteEmployee(): void {
    this.employeeService.deleteEmployee(this.employeeId).subscribe({
      next: () => {
        this.toasterService.success('Employee deleted successfully', 'Delete Successful');
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.toasterService.error('Failed to delete employee', 'Delete Failed');
      }
    });
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
    this.editForm.controls[datePickerId].setValue(today);
    this.closeDatePicker(datePickerId);
  }

  setNoDate(datePickerId: string): void {
    this.editForm.controls[datePickerId].setValue('No Date');
    this.closeDatePicker(datePickerId);
  }

  setNextMonday(datePickerId: string): void {
    const today = new Date();
    const nextMonday = new Date(today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7))).toLocaleDateString('en-CA');
    this.editForm.controls[datePickerId].setValue(nextMonday);
    this.closeDatePicker(datePickerId);
  }

  setNextTuesday(datePickerId: string): void {
    const today = new Date();
    const nextTuesday = new Date(today.setDate(today.getDate() + ((2 + 7 - today.getDay()) % 7 || 7))).toLocaleDateString('en-CA');
    this.editForm.controls[datePickerId].setValue(nextTuesday);
    this.closeDatePicker(datePickerId);
  }

  setAfterOneWeek(datePickerId: string): void {
    const today = new Date();
    const afterOneWeek = new Date(today.setDate(today.getDate() + 7)).toLocaleDateString('en-CA');
    this.editForm.controls[datePickerId].setValue(afterOneWeek);
    this.closeDatePicker(datePickerId);
  }

  selectDate(datePickerId: string, date: CalendarDate): void {
    if (!date.isOtherMonth) {
      const selectedDate = new Date(this.getDatePickerCurrentMonth(datePickerId).getFullYear(), this.getDatePickerCurrentMonth(datePickerId).getMonth(), date.day).toLocaleDateString('en-CA');
      this.editForm.controls[datePickerId].setValue(selectedDate);
    }
  }

  getDatePickerCurrentMonth(datePickerId: string): Date {
    return datePickerId === 'fromDate' ? this.fromDateCurrentMonth : this.toDateCurrentMonth;
  }

  cancelDate(datePickerId: string): void {
    this.editForm.controls[datePickerId].setValue('');
    this.closeDatePicker(datePickerId);
  }

  saveDate(datePickerId: string): void {
    this.closeDatePicker(datePickerId);
  }

  selectRole(role: string): void {
    this.editForm.controls['role'].setValue(role);
  }
}