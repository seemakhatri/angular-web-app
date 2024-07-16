import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from } from 'rxjs';

interface Employee {
  id?: number;
  name: string;
  role: string;
  fromDate: Date;
  toDate?: Date;
  swipeOpen?: boolean;
  hover?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private dbService: NgxIndexedDBService) {}

  addEmployee(employee: Employee): Observable<any> {
    return this.dbService.add('employees', employee);
  }

  getEmployees(): Observable<Employee[]> {
    return this.dbService.getAll('employees');
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.dbService.update('employees', employee);
  }

  getEmployeeById(id: number): Observable<Employee | undefined> {
    return this.dbService.getByID('employees', id);
  }


  deleteEmployee(id: number): Observable<any> {
    return this.dbService.delete('employees', id);
  }
  deleteAllEmployees(): Observable<any> {
    return from(this.dbService.clear('employees'));
  }

  
}
