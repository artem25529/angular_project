import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { CoreModule } from './core/core-module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { App } from './app';
import { Home } from './pages/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductEdit } from './pages/product-edit/product-edit';
import { CartPage } from './pages/cart/cart';
import { Auth } from './pages/auth/auth';

import {
  faStar,
  faPlus,
  faMinus,
  faCheck,
  faX,
  faUserPlus,
  faArrowRightToBracket,
  faArrowRightFromBracket,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [App, Home, ProductDetails, ProductEdit, CartPage, Auth],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    CoreModule,
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {
  constructor(private iconLibrary: FaIconLibrary) {
    this.loadIcons();
  }

  private loadIcons() {
    this.iconLibrary.addIcons(
      faStar,
      faPlus,
      faMinus,
      faCheck,
      faX,
      faArrowRightFromBracket,
      faArrowRightToBracket,
      faUserPlus,
      faCartShopping,
    );
  }
}
