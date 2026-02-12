import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appErrorMsg]',
  standalone: false,
})
export class ErrorMsgDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input('appErrorMsg') control!: NgModel | AbstractControl;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  private errorElem!: HTMLElement;
  private statusSubscription?: Subscription;

  ngOnInit() {
    if (!this.control.statusChanges) {
      return;
    }

    this.statusSubscription = this.control.statusChanges.subscribe((val) => {
      if (val === 'INVALID') {
        this.handleError();
      } else if (val === 'VALID') {
        this.hideError();
      }
    });
  }

  ngAfterViewInit() {
    const errorElem = this.renderer.createElement('div');
    this.renderer.addClass(errorElem, 'error-msg');
    this.renderer.setProperty(errorElem, 'hidden', true);

    this.errorElem = errorElem;
    this.renderer.appendChild(this.renderer.parentNode(this.el.nativeElement), errorElem);

    this.handleError();
  }

  handleError() {
    if (!this.control.errors) {
      return;
    }

    if (this.errorElem.firstChild) {
      this.renderer.removeChild(this.errorElem, this.errorElem.firstChild);
    }

    this.renderer.appendChild(
      this.errorElem,
      this.renderer.createText(this.getErrorMsg(this.control.errors)),
    );

    this.renderer.setProperty(this.errorElem, 'hidden', false);
  }

  hideError() {
    this.renderer.setProperty(this.errorElem, 'hidden', true);
  }

  getErrorMsg(errors: any): string {
    let msg;

    switch (Object.keys(errors)[0]) {
      case 'required':
        msg = 'Value is required.';
        break;
      case 'min':
        msg = `Value cannot be less than ${errors.min.min}.`;
        break;
      case 'minlength':
        msg = `Min length is ${errors.minlength.requiredLength}, actual is ${errors.minlength.actualLength}.`;
        break;
      case 'maxlength':
        msg = `Max length is ${errors.maxlength.requiredLength}, actual is ${errors.maxlength.actualLength}.`;
        break;
      case 'email':
        msg = `Enter valid email.`;
        break;
      case 'userabsent':
        msg = `User with such email doesn't exist.`;
        break;
      case 'passwordmismatch':
        msg = `Wrong password.`;
        break;
      case 'alreadyexists':
        msg = `User with such email already exist.`;
        break;
      default:
        msg = 'Invalid value.';
    }

    return msg;
  }

  ngOnDestroy() {
    if (!this.statusSubscription) {
      return;
    }

    this.statusSubscription.unsubscribe();
  }
}
