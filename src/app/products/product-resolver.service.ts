import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import{ ProductResolved } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class ProductResolver implements Resolve<ProductResolved> {

  constructor(private productService: ProductService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {
    const id = route.paramMap.get('id');
    if(isNaN(+id)){
      const message = `Product Id is not a Number ${id}`;
      console.error(message);
      return of({product: null, error: message});
    }

    return this.productService.getProduct(Number(id))
    .pipe(
      map(product => ({product:product})),
      catchError(error => {
        const message = `Retrival error: ${error}`;
        console.log(message);
        return of({product: null, error: message});
      })
    )
  }
}