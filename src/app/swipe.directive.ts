import { Directive, ElementRef, HostListener, Output, EventEmitter, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Output() swipeleft = new EventEmitter<void>();

  private initialX: number = 0;
  private initialY: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.initialX = event.touches[0].clientX;
    this.initialY = event.touches[0].clientY;
    console.log('Touch start:', this.initialX, this.initialY);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const deltaX = this.initialX - currentX;
    const deltaY = this.initialY - currentY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 50) {
      this.renderer.addClass(this.el.nativeElement, 'swiped-left');
      console.log('Swipe left detected');
      this.swipeleft.emit();
    }
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    console.log('Touch end');
  }
}
