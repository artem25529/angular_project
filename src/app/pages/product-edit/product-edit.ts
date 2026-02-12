import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product';

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
    private cdr: ChangeDetectorRef,
  ) {}

  product?: Product;
  productSubscription!: Subscription;
  editForm!: Product;

  ngOnInit() {
    this.initSubscriptions();
  }

  handleSubmit(form: NgForm) {
    if (form.valid) {
      this.productService.update(this.editForm).subscribe((_) => {});
    }
  }

  initSubscriptions() {
    this.activatedRoute.params.subscribe((params) => {
      this.productSubscription = this.productService.getById(+params['id']).subscribe((value) => {
        this.product = value;
        this.editForm = structuredClone(value);
        this.cdr.markForCheck();
      });
    });
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
