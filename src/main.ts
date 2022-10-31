import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BlockService } from './block/block.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.NODE_ENV);
  console.log(process.env.MONGO_URL_PROD);
  app.enableCors();
  await app.listen(parseInt(process.env.PORT) || 4000);
  const blockService = app.get(BlockService);
  const lastBlockNumber = await blockService.getLastBlockNumber();
  blockService.fillDatabaseWithLast1000Blocks(lastBlockNumber);
}
bootstrap();
