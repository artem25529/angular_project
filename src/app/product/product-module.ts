import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core-module';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { AppliedFiltersComponent } from './components/applied-filters/applied-filters.component';
import { AddToCartButtonComponent } from './components/add-to-cart-button/add-to-cart-button.component';
import { ReviewComponent } from './components/review/review.component';
import { StockInfoDirective } from './directives/stock-info.directive';
import { ProductRoutingModule } from './product-routing-module';
import { Home } from './pages/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductEdit } from './pages/product-edit/product-edit';

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductFiltersComponent,
    ProductInfoComponent,
    AddToCartButtonComponent,
    AppliedFiltersComponent,
    ReviewComponent,
    StockInfoDirective,
    Home,
    ProductDetails,
    ProductEdit,
  ],
  imports: [CoreModule, ProductRoutingModule],
})
export class ProductModule {}
