import { Transaction } from "../schemas/transaction.schema";

export class SearchResultTransaction {
    transactions: Transaction[];
    transactionsCount: number;

    constructor() {
        this.transactions = [];
        this.transactionsCount = 0;
    }
}