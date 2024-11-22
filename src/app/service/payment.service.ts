import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Payment, PaymentYearReport} from '../model/payment';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  getPayments(year: number): Promise<PaymentYearReport> {
    return lastValueFrom(this.http.get('/payment?year=' + year))
      .then(
        (response) => response as PaymentYearReport,
        (error) => Promise.reject(error.message)
      );
  }

  getPayment(id: number): Promise<Payment> {
    return lastValueFrom(this.http.get('/payment/' + id))
      .then(
        (response) => response as Payment,
        (error) => Promise.reject(error.message)
      );
  }

  savePayment(payment: Payment): Promise<Payment> {
    if (payment.id) {
      return lastValueFrom(this.http.put('/payment', payment))
        .then(
          (response) => response as Payment,
          (error) => Promise.reject(error.message)
        );
    }
    return lastValueFrom(this.http.post('/payment', payment))
      .then(
        (response) => response as Payment,
        (error) => Promise.reject(error.message)
      );
  }

  deletePayment(id: number): Promise<void> {
    return lastValueFrom(this.http.delete('/payment/' + id, {responseType: 'text'}))
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
