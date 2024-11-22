import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from '../model/product';

@Component({
  selector: 'app-gear',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Output() togglePayEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  state = 0;

  ngOnInit() {
  }

  onDelete() {
    this.deleteEvent.emit(this.product.id);
  }

  onTogglePay() {
    this.togglePayEvent.emit(this.product.id);
  }
}
