import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { Home } from '@product/pages/home/home';
import { ProductDetails } from '@product/pages/product-details/product-details';
import { ProductEdit } from '@product/pages/product-edit/product-edit';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: ProductDetails },
  { path: 'product/edit/:id', component: ProductEdit, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductRoutingModule {}
