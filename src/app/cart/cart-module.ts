import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core-module';
import { CartRoutingModule } from '@cart/cart-routing-module';
import { CartPage } from '@cart/pages/cart/cart';

@NgModule({
  declarations: [CartPage],
  imports: [CoreModule, CartRoutingModule],
})
export class CartModule {}
