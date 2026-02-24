import {
  Component,
  Input,
  OnInit,
  HostBinding,
  HostListener,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rating-select',
  standalone: false,
  templateUrl: './rating-select.component.html',
  styleUrl: './rating-select.component.scss',
})
export class RatingSelectComponent implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}

  @Input() control!: AbstractControl<number>;
  private valueChangesSub!: Subscription;

  ngOnInit() {
    this.valueChangesSub = this.control.valueChanges.subscribe((_) => this.cdr.detectChanges());
  }

  @HostBinding('attr.tabindex')
  tabIndex = 0;

  @HostBinding('attr.role')
  role = 'switch';

  @HostBinding('attr.aria-valuenow')
  get ariaValueNow() {
    return this.control.value;
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        this.selectRating(this.control.value < 5 ? this.control.value + 1 : this.control.value);
        break;

      case 'ArrowLeft':
      case 'ArrowDown':
        this.selectRating(this.control.value > 0 ? this.control.value - 1 : this.control.value);
        break;
    }
  }

  selectRating(count: number) {
    this.control.setValue(count);

    if (this.control.value) {
      this.control.markAsDirty();
    }
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
  }
}
