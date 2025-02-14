export class Payment {
  id: number;
  date: string;
  timestamp: number;
  amount: number;
  comment: string;
  canEdit: boolean;
  balance: number;
  transientExpense: boolean;
}

export class PaymentYearReport {
  payments: Payment[];
  startYearBalance: number;
}
