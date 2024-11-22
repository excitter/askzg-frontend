export class Payment {
  id: number;
  date: string;
  timestamp: number;
  amount: number;
  comment: string;
  canEdit: boolean;
  balance: number;
}

export class PaymentYearReport {
  payments: Payment[];
  startYearBalance: number;
}
