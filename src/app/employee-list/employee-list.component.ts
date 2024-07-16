import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../Services/employee.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Employee {
  id?: number;
  name: string;
  role: string;
  fromDate: Date;
  toDate?: Date;
  swipeOpen?: boolean;
  hover?: boolean; 
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private router: Router,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      console.log('Employees loaded:', employees);
      this.currentEmployees = employees.filter(employee => !employee.toDate || isNaN(new Date(employee.toDate).getTime()));
      this.previousEmployees = employees.filter(employee => employee.toDate && !isNaN(new Date(employee.toDate).getTime()));
    }, error => {
      console.error('Error loading employees', error);
    });
  }

  toggleSwipe(index: number, open: boolean): void {
    this.currentEmployees.forEach((emp, i) => emp.swipeOpen = i === index && open);
    this.previousEmployees.forEach((emp, i) => emp.swipeOpen = i + this.currentEmployees.length === index && open);
  }


  deleteEmployee(index: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    const employeeList = index < this.currentEmployees.length ? this.currentEmployees : this.previousEmployees;
    const employeeIndex = index < this.currentEmployees.length ? index : index - this.currentEmployees.length;
    const employee = employeeList[employeeIndex];

    if (employee.id !== undefined) {
      setTimeout(() => {
        this.employeeService.deleteEmployee(employee.id as number).subscribe(() => {
          this.toasterService.success('Employee data has been deleted!', 'Success');
          employeeList.splice(employeeIndex, 1);
        });
      }, 1000);
    }
  }

  deleteAllEmployees(): void {
    this.employeeService.deleteAllEmployees().subscribe(() => {
      this.currentEmployees = [];
      this.previousEmployees = [];
    }, error => {
      console.error('Failed to delete all employees:', error);
    });
  }

  editEmployee(id: number): void {
    this.router.navigate(['/edit-employee', id]);
  }
}
