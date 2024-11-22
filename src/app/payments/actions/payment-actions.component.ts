import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Payment} from '../../model/payment';

@Component({
  selector: 'app-payment-actions',
  templateUrl: './payment-actions.component.html',
  styleUrls: ['./payment-actions.component.css']
})
export class PaymentActionsComponent implements OnInit {

  @Input() payment: Payment;
  @Output() editEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  state = 0;

  constructor() {
  }

  ngOnInit() {
  }

  onEdit(id) {
    this.editEvent.emit(id);
  }

  onDelete(id) {
    this.deleteEvent.emit(id);
  }

}
