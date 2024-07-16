import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle: string = 'Employee List';
  @Input() showDeleteIcon: boolean = false;
  @Output() deleteEmployeeEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setHeaderTitleAndIcon(this.router.url);
      }
    });
  }

  setHeaderTitleAndIcon(url: string) {
    if (url.includes('add-employee')) {
      this.headerTitle = 'Add Employee Details';
      this.showDeleteIcon = false;
    } else if (url.includes('edit-employee')) {
      this.headerTitle = 'Edit Employee Details';
      this.showDeleteIcon = true;
    } else {
      this.headerTitle = 'Employee List';
      this.showDeleteIcon = false;
    }
  }
  deleteEmployee() {
    this.deleteEmployeeEvent.emit();
  }
}
