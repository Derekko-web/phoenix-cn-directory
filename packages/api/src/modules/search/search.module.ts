import { Module } from '@nestjs/common';
import { SearchModule as CommonSearchModule } from '../../common/search/search.module';
import { SearchController } from './search.controller';

@Module({
  imports: [CommonSearchModule],
  controllers: [SearchController],
})
export class SearchModule {}