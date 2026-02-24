import { Component, Input, HostListener } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-checkbox',
  standalone: false,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  @Input() control!: AbstractControl<boolean>;
  @Input() label!: string;
  id: string = uuidv4();

  @HostListener('click')
  handleClick() {
    this.toggleCheck();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.toggleCheck();
    }
  }

  toggleCheck() {
    this.control.setValue(!this.control.value);

    if (this.control.value) {
      this.control.markAsDirty();
    }
  }
}
