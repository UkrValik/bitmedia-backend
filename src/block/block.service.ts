import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { Block, BlockDocument } from './schemas/block.schema';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class BlockService {

    private ETHERSCAN_API_URL = process.env.ETHERSCAN_API_URL;
    private ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    private GET_BLOCK_QUERY = '?module=proxy&action=eth_getBlockByNumber&boolean=true';
    private GET_LAST_BLOCK_NUMBER_QUERY = '?module=proxy&action=eth_blockNumber&apikey=';
    private logger = new Logger(BlockService.name);

    constructor(
        @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
        private transactionService: TransactionService,
        private httpService: HttpService,
    ) {}

    private async getLastBlock(blockNumber: string): Promise<BlockDocument> {
        const url = `${this.ETHERSCAN_API_URL}${this.GET_BLOCK_QUERY}&tag=${blockNumber}&apikey=${this.ETHERSCAN_API_KEY}`;
        try {
            const { data } = await firstValueFrom(this.httpService.get(url));
            if (data.result) {
                const createdBlock = new this.blockModel(data.result);
                return createdBlock;
            } else {
                await new Promise(r => setTimeout(r, 1000));
                return this.getLastBlock(blockNumber);
            }
        } catch(error) {
            this.logger.error(error.message, 'BlockService.getLastBlock');
        }
    }

    private async saveLastBlock(blockNumber: string): Promise<void> {
        const block = await this.getLastBlock(blockNumber);
        try {
            await block.save();
            await this.transactionService.saveMany(block);
            this.logger.log('Saved block with number: ' + blockNumber + ' - ' + parseInt(blockNumber, 16));
            this.logger.log('Saved ' + block.transactions.length + ' transactions.');
        } catch (error) {
            this.logger.error(error.message, 'BlockService.saveLastBlock');
        }
    }

    async fillDatabaseWithLast1000Blocks(currentBlockNumber: string): Promise<void> {
        try {
            const blocksCountInDatabase = await this.blockModel.count({});
            for (let i = 0; i < 1000 - blocksCountInDatabase; ++i) {
                await this.saveLastBlock(currentBlockNumber);
                currentBlockNumber = (parseInt(currentBlockNumber, 16) + 1).toString(16);
            }
        } catch (error) {
            this.logger.error(error.message, 'BlockService.fillDatabaseWithLast1000Blocks');
        }
    }

    async getLastBlockNumber(): Promise<string> {
        const url = `${this.ETHERSCAN_API_URL}${this.GET_LAST_BLOCK_NUMBER_QUERY}${this.ETHERSCAN_API_KEY}`;
        try {
            const { data } = await firstValueFrom(this.httpService.get(url));
            return data.result;
        } catch (error) {
            this.logger.error(error.message, 'BlockService.getLastBlockNumber');
        }
    }

}
