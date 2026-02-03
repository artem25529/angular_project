import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AddToCartButtonComponent } from './components/add-to-cart-button/add-to-cart-button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AppRoutingModule } from '../app-routing-module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReviewComponent } from './components/review/review.component';
import { StockInfoDirective } from './directives/stock-info.directive';
import { RatingComponent } from './components/rating/rating.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { RatingSelectComponent } from './components/rating-select/rating-select.component';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { AppliedFiltersComponent } from './components/applied-filters/applied-filters.component';
import { ErrorMsgDirective } from './directives/error-msg.directive';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  imports: [CommonModule, FaIconComponent, AppRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    AddToCartButtonComponent,
    NavBarComponent,
    ReviewComponent,
    StockInfoDirective,
    RatingComponent,
    ProductInfoComponent,
    RatingSelectComponent,
    ProductFiltersComponent,
    CheckboxComponent,
    AppliedFiltersComponent,
    ErrorMsgDirective,
    NotificationComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    AddToCartButtonComponent,
    ReviewComponent,
    RatingComponent,
    ProductInfoComponent,
    StockInfoDirective,
    RatingSelectComponent,
    ProductFiltersComponent,
    CheckboxComponent,
    AppliedFiltersComponent,
    ErrorMsgDirective,
    NotificationComponent,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('Core module was already loaded');
    }
  }
}
