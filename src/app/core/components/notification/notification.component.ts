import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { delay, Subscription, tap } from 'rxjs';
import { Notification } from '@core/models/notification';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  constructor(
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  private subscription!: Subscription;
  notification: Notification | null = null;

  ngOnInit() {
    this.subscription = this.sharedDataService.notification$
      .pipe(
        tap((n) => {
          this.notification = n;
          this.cdr.markForCheck();

          setTimeout(() => {
            this.notification = null;
            this.cdr.markForCheck();
          }, 4900);
        }),
        delay(5000),
      )
      .subscribe((_) => {});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
