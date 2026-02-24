import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RatingComponent } from './components/rating/rating.component';
import { RatingSelectComponent } from './components/rating-select/rating-select.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ErrorMsgDirective } from './directives/error-msg.directive';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavBarComponent,
    RatingComponent,
    RatingSelectComponent,
    CheckboxComponent,
    NotificationComponent,
    ErrorMsgDirective,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent,

    HeaderComponent,
    FooterComponent,
    NavBarComponent,
    RatingComponent,
    RatingSelectComponent,
    CheckboxComponent,
    NotificationComponent,
    ErrorMsgDirective,
  ],
})
export class CoreModule {}
