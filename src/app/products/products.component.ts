import {Component, OnInit} from '@angular/core';
import {Product} from '../model/product';
import {ProductService} from '../service/product.service';
import {AppDataService} from '../service/app-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  allProducts: Product[] = [];
  products: Product[] = [];
  hidePaid = true;

  constructor(private productService: ProductService, private appDataService: AppDataService) {
  }

  ngOnInit() {
    this.productService.getProducts(true).then(
      (products) => {
        this.allProducts = products;
        this.filterProducts();
      }
    );
  }

  onDelete(id: number) {
    this.productService.deleteProduct(id).then(
      () => {
        this.appDataService.reloadBalance();
        this.allProducts.splice(this.allProducts.findIndex(p => p.id === id), 1);
        this.filterProducts();
      }
    );
  }

  filterProducts() {
    this.products = this.allProducts.filter(p => !this.hidePaid || !p.paid);
  }
}
