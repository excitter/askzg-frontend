import {Component, OnDestroy, OnInit} from '@angular/core';
import {Payment} from '../../model/payment';
import {PaymentService} from '../../service/payment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {currentDate} from '../../util/util-functions';
import {AppDataService} from '../../service/app-data.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  private sub: any;
  payment: Payment = new Payment();
  saveInProgress = false;
  error = false;
  negative = false;

  constructor(private paymentService: PaymentService, private route: ActivatedRoute, private router: Router,
              private appDataService: AppDataService, private location: Location) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.payment = new Payment();
        this.negative = false;
        this.payment.date = currentDate();
      } else {
        this.paymentService.getPayment(id).then(
          (payment) => {
            this.negative = payment.amount < 0;
            payment.amount = Math.abs(payment.amount);
            this.payment = payment;

          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  togglePlusMinus() {
    this.negative = !this.negative;
  }

  onSave() {
    this.saveInProgress = true;
    this.error = false;
    let temp = Math.abs(this.payment.amount);
    if (this.negative) {
      temp = -1 * temp;
    }
    this.payment.amount = temp;
    this.paymentService.savePayment(this.payment).then(
      () => {
        this.appDataService.reloadBalance();
        this.saveInProgress = false;
        this.onBack();
      },
      (error) => {
        this.saveInProgress = false;
        this.error = true;
      }
    );
  }

  onBack() {
    this.location.back();
  }
}
