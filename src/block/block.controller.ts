import { Controller, Get } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {

    constructor(
        private blockService: BlockService,
    ) {}

    @Get('last-number')
    async getLastNumber(): Promise<number> {
        const lastBlockNumber = await this.blockService.getLastBlockNumber();
        return parseInt(lastBlockNumber, 16);
    }
}
