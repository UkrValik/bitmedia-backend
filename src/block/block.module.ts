import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { BlockService } from './block.service';
import { Transaction, TransactionSchema } from 'src/transaction/schemas/transaction.schema';
import { Block, BlockSchema } from './schemas/block.schema';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { BlockController } from './block.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Transaction.name, schema: TransactionSchema},
      {name: Block.name, schema: BlockSchema},
    ]),
    HttpModule,
    TransactionModule,
  ],
  providers: [BlockService, TransactionService],
  controllers: [BlockController]
})
export class BlockModule {}
