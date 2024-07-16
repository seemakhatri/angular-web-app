import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() showAddButton: boolean = false;
  @Input() showSwipeDelete: boolean = false;
  @Input() showCancelSaveButtons: boolean = false;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateFooterButtons(this.router.url);
      }
    });
  }


  goToAddEmployee(): void {
    this.router.navigate(['/add-employee']);
  }

  updateFooterButtons(url: string) {
    if (url.includes('employees')) {
      this.showAddButton = true;
      this.showCancelSaveButtons = false;
      this.showSwipeDelete = true;
    } else if (url.includes('add-employee') || url.includes('edit-employee')) {
      this.showAddButton = false;
      this.showCancelSaveButtons = true;
      this.showSwipeDelete = false;
    } else {
      this.showAddButton = false;
      this.showCancelSaveButtons = false;
      this.showSwipeDelete = false;
    }
  }


  onCancel() {
    this.cancelEvent.emit();
  }

  onSave() {
    this.saveEvent.emit();
  }

}
