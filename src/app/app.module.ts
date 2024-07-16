import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwipeDirective } from './swipe.directive';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ToastrModule } from 'ngx-toastr';

const dbConfig: DBConfig = {
  name: 'EmployeeDB',
  version: 1,
  objectStoresMeta: [{
    store: 'employees',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'role', keypath: 'role', options: { unique: false } },
      { name: 'fromDate', keypath: 'fromDate', options: { unique: false } },
      { name: 'toDate', keypath: 'toDate', options: { unique: false } }
    ]
  }]
};




@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    SwipeDirective,
    HeaderComponent,
    FooterComponent,
    AddEmployeeComponent,
    EditEmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ToastrModule.forRoot({
      timeOut: 3000, 
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
          preventDuplicates: true,
    }),
    
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
