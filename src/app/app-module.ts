import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CoreModule } from '@core/core-module';
import { ProductModule } from '@product/product-module';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

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
  declarations: [App],
  imports: [BrowserModule, FontAwesomeModule, CoreModule, ProductModule, AppRoutingModule],
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
