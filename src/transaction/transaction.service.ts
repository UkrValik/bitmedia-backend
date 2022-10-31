import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from 'src/block/schemas/block.schema';
import { SearchResultTransaction } from './dto/search-result.dto';

import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionService {

    private logger = new Logger(TransactionService.name);

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) {}

    async saveMany(block: Block): Promise<Transaction[]> {
        let savedTransactions = [];
        for (let transaction of block.transactions) {
            try {
                transaction.timestamp = block.timestamp;
                transaction.blockBaseFeePerGas = block.baseFeePerGas;
                transaction.gasUsed = block.gasUsed;
                const createdTransaction = new this.transactionModel(transaction);
                savedTransactions.push(await createdTransaction.save());
            } catch (error) {
                this.logger.error(error.message, 'TransactionService.saveMany');
            }
        }
        return savedTransactions;
    }

    async searchByBlockNumber(blockNumber: string, page: number, pageSize: number): Promise<SearchResultTransaction> {
        try {
            const transactions = await this.transactionModel.find({$or: [{blockNumber}, {blockNumber: `0x${parseInt(blockNumber).toString(16)}`}]}, null, {skip: (page - 1) * pageSize, limit: pageSize}).exec();
            const transactionsCount = await this.transactionModel.count({$or: [{blockNumber}, {blockNumber: `0x${parseInt(blockNumber).toString(16)}`}]});
            return {transactions, transactionsCount};
        } catch (error) {
            this.logger.error(error.message, 'TransactionService.searchByBlockNumber');
        }
    }

    async searchByAddress(address: string, page: number, pageSize: number): Promise<SearchResultTransaction> {
        try {
            const transactions = await this.transactionModel.find({$or: [{from: address}, {to: address}]}, null, {skip: (page - 1) * pageSize, limit: pageSize}).exec();
            const transactionsCount = await this.transactionModel.count({$or: [{from: address}, {to: address}]});
            return {transactions, transactionsCount};
        } catch (error) {
            this.logger.error(error.message, 'TransactionService.searchByAddress');
        }
    }

    async searchByTransactionId(transactionId: string): Promise<SearchResultTransaction> {
        try {
            const transactions = await this.transactionModel.find({hash: transactionId}).exec();
            return {transactions, transactionsCount: transactions.length};
        } catch (error) {
            this.logger.error(error.message, 'TransactionService.searchByTransactionId');
        }
    }

    async findAll(page: number, pageSize: number): Promise<SearchResultTransaction> {
        try {
            const transactions = await this.transactionModel.find({}, null, {skip: (page - 1) * pageSize, limit: pageSize}).exec();
            const transactionsCount = await this.transactionModel.count({});
            return {transactions, transactionsCount};
        } catch (error) {
            this.logger.error(error.message, 'TransactionService.findAll');
        }
    }

}
