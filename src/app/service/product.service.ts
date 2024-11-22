import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../model/product';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts(all: boolean): Promise<Product[]> {
    return this.http.get('/product?all=' + all)
      .toPromise().then(
        (response) => response as Product[],
        (error) => Promise.reject(error.message)
      );
  }

  getProduct(id: number): Promise<Product> {
    return this.http.get('/product/' + id)
      .toPromise().then(
        (response) => response as Product,
        (error) => Promise.reject(error.message)
      );
  }

  saveProduct(payment: Product): Promise<Product> {
    if (payment.id) {
      return this.http.put('/product', payment).toPromise()
        .then(
          (response) => response as Product,
          (error) => Promise.reject(error.message)
        );
    }
    return this.http.post('/product', payment).toPromise()
      .then(
        (response) => response as Product,
        (error) => Promise.reject(error.message)
      );
  }

  payProduct(id: number, amount: number): Promise<Product> {
    return this.http.put('/product/pay', {id: id, amount: amount}).toPromise()
      .then(
        (response) => response as Product,
        (error) => Promise.reject(error.message)
      );
  }

  deleteProduct(id: number): Promise<void> {
    return this.http.delete('/product/' + id, {responseType: 'text'}).toPromise()
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
