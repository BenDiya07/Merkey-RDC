import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRevealAnimation]',
  standalone: true
})
export class RevealAnimationDirective implements AfterViewInit, OnDestroy {
  @Input() appRevealAnimation = '0s';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement as HTMLElement;

    if (this.appRevealAnimation && this.appRevealAnimation !== '0s') {
      this.renderer.setStyle(element, 'transition-delay', this.appRevealAnimation);
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, 'reveal-visible');
      return;
    }

    this.renderer.addClass(element, 'reveal');

    if (element.dataset['revealed']) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(element, 'reveal-visible');
            element.dataset['revealed'] = 'true';
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}