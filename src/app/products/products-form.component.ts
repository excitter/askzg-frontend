import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../model/product';
import {ProductService} from '../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppDataService} from '../service/app-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.css']
})
export class ProductsFormComponent implements OnInit, OnDestroy {


  product: Product = new Product();
  saveInProgress = false;
  sub: Subscription;
  mode = 'NEW';

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router,
              private appDataService: AppDataService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.product = new Product();
        this.mode = 'NEW';
      } else {
        this.productService.getProduct(id).then(
          (product) => {
            const mode = params['mode'] as string;
            this.mode = mode.toLocaleUpperCase();
            this.product = product;
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSave() {
    this.saveInProgress = true;
    if (this.mode === 'NEW' || this.mode === 'EDIT') {
      this.productService.saveProduct(this.product).then(
        () => {
          this.appDataService.reloadBalance();
          this.saveInProgress = false;
          this.router.navigate(['products']);
        },
        () => this.saveInProgress = false
      );
    } else if (this.mode === 'PAY') {
      this.productService.payProduct(this.product.id, this.product.price).then(
        () => {
          this.appDataService.reloadBalance();
          this.saveInProgress = false;
          this.router.navigate(['products']);
        },
        () => this.saveInProgress = false
      );
    }
  }
}
