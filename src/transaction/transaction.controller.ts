import { Controller, Get, ParseEnumPipe, ParseIntPipe, Query } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { DefaultResponseTransaction } from './dto/default-response.dto';
import { QuerySearchEnum } from './enum/query-search.enum';
import { SearchResultTransaction } from './dto/search-result.dto';

@Controller('transaction')
export class TransactionController {

    constructor(
        private transactionService: TransactionService,
    ) {}

    @Get('search')
    async search(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('searchBy') searchBy: string,
        @Query('value') value: string,
    ): Promise<DefaultResponseTransaction> {
        let searchRes: SearchResultTransaction = new SearchResultTransaction();
        if (value === '') {
            searchBy = 'all';
        }
        switch (searchBy) {
            case QuerySearchEnum.address:
                searchRes = await this.transactionService.searchByAddress(value, page, pageSize);
                break;
            case QuerySearchEnum.blockNumber:
                searchRes = await this.transactionService.searchByBlockNumber(value, page, pageSize);
                break;
            case QuerySearchEnum.transactionId:
                searchRes = await this.transactionService.searchByTransactionId(value);
                break;
            default:
                searchRes = await this.transactionService.findAll(page, pageSize);
        };
        if (!searchRes.transactions) {
            searchRes = new SearchResultTransaction();
        }
        return new DefaultResponseTransaction({
            status: 'success',
            message: 'Received transactions',
            transactions: searchRes.transactions,
            transactionsCount: searchRes.transactionsCount,
        });
    }

}
