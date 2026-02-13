import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'cart', loadChildren: () => import('@cart/cart-module').then((m) => m.CartModule) },
  { path: 'auth', loadChildren: () => import('@auth/auth-module').then((m) => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
