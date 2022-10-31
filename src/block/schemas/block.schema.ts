import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Transaction } from 'src/transaction/schemas/transaction.schema';

export type BlockDocument = Block & Document;

@Schema()
export class Block {

    @Prop({ required: true })
    baseFeePerGas: string;

    @Prop()
    difficulty: string;

    @Prop()
    extraData: string;

    @Prop({ required: true })
    gasLimit: string;

    @Prop({ required: true })
    gasUsed: string;

    @Prop({ required: true })
    hash: string;

    @Prop()
    logsBloom: string;

    @Prop({ required: true })
    miner: string;

    @Prop()
    mixHash: string;

    @Prop({ required: true })
    nonce: string;

    @Prop({ required: true })
    number: string;

    @Prop({ required: true })
    parentHash: string;

    @Prop()
    receiptsRoot: string;

    @Prop()
    sha3Uncles: string;

    @Prop({ required: true })
    size: string;

    @Prop()
    stateRoot: string;

    @Prop({ required: true })
    timestamp: string;

    @Prop()
    totalDifficulty: string;

    @Prop({ required: true })
    transactions: [Transaction];

    @Prop()
    transactionsRoot: string;

    @Prop()
    uncles: [string];

}

export const BlockSchema = SchemaFactory.createForClass(Block);
