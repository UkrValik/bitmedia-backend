import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {

    @Prop({ required: true })
    blockHash: string;

    @Prop({ required: true })
    blockNumber: string;

    @Prop({ required: true })
    from: string;

    @Prop({ required: true })
    gas: string;

    @Prop({ required: true })
    gasPrice: string;

    @Prop()
    maxFeePerGas: string;

    @Prop()
    maxPriorityFeePerGas: string;

    @Prop({ required: true })
    hash: string;

    @Prop({ required: true })
    input: string;

    @Prop({ required: true })
    nonce: string;

    @Prop()
    to: string;

    @Prop({ required: true })
    transactionIndex: string;

    @Prop({ required: true })
    value: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    accessList: [object]

    @Prop()
    chainId: string;

    @Prop({ required: true })
    v: string;

    @Prop({ required: true })
    r: string;

    @Prop({ required: true })
    s: string;

    @Prop({ required: true })
    timestamp: string;

    @Prop({ required: true })
    blockBaseFeePerGas: string;

    @Prop({ required: true })
    gasUsed: string;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
