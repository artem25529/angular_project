import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductEdit } from './pages/product-edit/product-edit';
import { CartPage } from './pages/cart/cart';
import { Auth } from './pages/auth/auth';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: ProductDetails },
  { path: 'product/edit/:id', component: ProductEdit, canActivate: [AuthGuard] },
  { path: 'cart', component: CartPage, canActivate: [AuthGuard] },
  { path: 'auth', component: Auth },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
