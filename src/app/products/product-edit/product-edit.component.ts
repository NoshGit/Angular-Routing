import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';
import * as _  from 'lodash';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage: string;

  //product: Product;

  get isDirty(): boolean{

    return !_.isEqual(this.currentProduct, this.originalProduct);

  }

  private dataIsValid: { [Key:string]: boolean} = {};
  private currentProduct: Product;
  private originalProduct: Product;

  get product(): Product {
    return this.currentProduct
  }

  set product(value: Product) {
    this.currentProduct = value;
    //clone the object to retain copy
    this.originalProduct = { ...value };
  }

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(){
    //let id = +this.route.snapshot.paramMap.get('id');
    //Get Route Param dynamic on change with ParamsMap Observable
    this.route.data.subscribe(
      data => {
        const resolvedData: ProductResolved = data['resolvedData'];
        this.errorMessage = resolvedData.error;
        this.onProductRetrieved(resolvedData.product);
      }
    );    
  }

  /*getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }*/

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  //FOr validation
  isValid(path?: string): boolean {
    this.validate();

    if(path){
      return this.dataIsValid[path];
    }

    return (this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d]))
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  reset(): void {
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }

    this.reset();

    // Navigate back to the product list
    this.router.navigate(['/products']);
  }

  validate(): void {
    //Clear the validation object
    this.dataIsValid = {};

    //info Tab
    this.dataIsValid['info'] = (this.product.productName && this.product.productName.length >= 3 && this.product.productCode)?true:false;

    //Tags Tab
    this.dataIsValid['tags'] = this.product.category && this.product.category.length >=3;

  }
}
