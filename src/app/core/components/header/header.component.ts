import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, first, Subscription } from 'rxjs';
import { SharedDataService } from '../../services/shared-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    public sharedDataService: SharedDataService,
    public authService: AuthService,
  ) {
    this.inputControl = new FormControl('');
  }

  inputControl: FormControl;
  subscription!: Subscription;

  ngOnInit() {
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initSubscriptions() {
    this.inputControl.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this.sharedDataService.updateHeaderInputSubject(value!);
    });

    this.subscription = this.sharedDataService.headerInput$
      .pipe(
        filter((value) => value !== null && value !== undefined),
        first(),
      )
      .subscribe((value) => this.inputControl.setValue(value, { emitEvent: false }));
  }

  logout() {
    this.authService.logout();
  }
}
