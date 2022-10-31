import { Transaction } from "../schemas/transaction.schema";

export class DefaultResponseTransaction {
    status: string;
    message: string;
    transactions: Transaction[];
    transactionsCount: number;

    constructor(data: any) {
        this.status = data.status;
        this.message = data.message;
        this.transactions = data.transactions;
        this.transactionsCount = data.transactionsCount;
    }
}