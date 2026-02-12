import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { NumberParser } from '@internationalized/number';
import { ProductFiltersForm } from '../models/product-filters-form';
import { ProductFilters } from '../models/product-filters';
import { Params } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { UserService } from './user.service';
import { map, Observable } from 'rxjs';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private userService: UserService,
    private sharedDataService: SharedDataService,
  ) {
    this.initData();
  }

  numberParser!: NumberParser;

  private initData() {
    this.numberParser = new NumberParser(this.locale);
  }

  loginValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const form = control as FormGroup;

      const emailControl = form.get('email')!;
      const passwordControl = form.get('password')!;

      const email = emailControl.value.trim();
      const password = passwordControl.value.trim();

      return this.userService.getByEmail(email).pipe(
        map((user) => {
          if (!user) {
            const errors = { userabsent: true };
            emailControl.setErrors(errors);
            return errors;
          } else if (user.password !== password) {
            const errors = { passwordmismatch: true };
            passwordControl.setErrors(errors);
            return errors;
          }

          this.sharedDataService.lastValidatedUser = user;
          return null;
        }),
      );
    };
  }

  signupValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userService.getByEmail(control.value).pipe(
        map((user) => {
          if (user) {
            return { alreadyexists: true };
          }

          return null;
        }),
      );
    };
  }

  createProductFilters(value: ProductFiltersForm): ProductFilters {
    const { rating, price, hasReviews, inStock } = value;
    const result: ProductFilters = {};

    if (rating[0] || rating[1]) {
      if (rating[0] && rating[1] && rating[0] > rating[1]) {
        result.rating = `${rating[0]}|`;
      } else {
        result.rating = `${rating[0] || ''}|${rating[1] || ''}`;
      }
    }

    if (price[0].trim() || price[1].trim()) {
      const minPrice = this.numberParser.parse(price[0]);
      const maxPrice = this.numberParser.parse(price[1]);

      if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
        result.price = `${String(minPrice)}|`;
      } else if (!isNaN(minPrice) || !isNaN(maxPrice)) {
        result.price = `${isNaN(minPrice) ? '' : String(minPrice)}|${isNaN(maxPrice) ? '' : String(maxPrice)}`;
      }
    }

    if (hasReviews) {
      result.hasReviews = 'yes';
    }

    if (inStock) {
      result.inStock = 'yes';
    }

    return result;
  }

  createProductFiltersFromParams(params: Params): ProductFilters {
    let { rating = '', price = '', hasReviews = '', inStock = '' } = params;

    if (rating.includes('|')) {
      let [min, max] = rating.split('|');
      const minNum = this.numberParser.parse(min);
      const maxNum = this.numberParser.parse(max);

      min = isNaN(minNum) ? '' : min;
      max = isNaN(maxNum) ? '' : max;

      if (min || max) {
        rating = `${min}|${max}`;
      } else {
        rating = '';
      }
    }

    if (price.includes('|')) {
      let [min, max] = price.split('|');
      const minNum = this.numberParser.parse(min);
      const maxNum = this.numberParser.parse(max);

      min = isNaN(minNum) ? '' : min;
      max = isNaN(maxNum) ? '' : max;

      if (min || max) {
        price = `${min}|${max}`;
      } else {
        price = '';
      }
    }

    return {
      rating,
      price,
      hasReviews,
      inStock,
    };
  }

  createProductFiltersFormFromProductFilters(productFilters: ProductFilters): ProductFiltersForm {
    const result: ProductFiltersForm = {
      rating: [0, 0],
      price: ['', ''],
      hasReviews: false,
      inStock: false,
    };

    if (productFilters.rating) {
      const values = productFilters.rating.split('|');

      if (values.length === 2) {
        result.rating = [+values[0], +values[1]];
      }
    }

    if (productFilters.price) {
      const values = productFilters.price.split('|');

      if (values.length === 2) {
        result.price = [values[0], values[1]];
      }
    }

    result.hasReviews = !!productFilters.hasReviews;
    result.inStock = !!productFilters.inStock;

    return result;
  }
}
