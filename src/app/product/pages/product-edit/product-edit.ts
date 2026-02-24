import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '@product/services/product.service';
import { Product } from '@product/models/product';
import { SharedDataService } from '@core/services/shared-data.service';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  product!: Product | null;
  productSubscription!: Subscription;
  editForm!: Product;

  ngOnInit() {
    this.initSubscriptions();
  }

  handleSubmit(form: NgForm) {
    if (form.valid) {
      this.productService.update(this.editForm).subscribe((res) => {
        if (res) {
          this.sharedDataService.updateNotificationSubject({
            type: 'success',
            message: `Product ${res.id} was updated successfully.`,
          });
        }
      });
    }
  }

  initSubscriptions() {
    this.activatedRoute.params.subscribe((params) => {
      this.productSubscription = this.productService.getById(+params['id']).subscribe((value) => {
        this.product = value;

        if (value) {
          this.editForm = structuredClone(value);
          this.cdr.markForCheck();
        }
      });
    });
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
