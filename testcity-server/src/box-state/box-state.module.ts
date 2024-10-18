import { Module } from '@nestjs/common';
import { BoxStateService } from './box-state.service';
import { BoxStateController } from './box-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArequipaBoxes } from './entities/box-state-arequipa.entity';
import { LimaBoxes } from './entities/box-state-lima.entity';

@Module({
  controllers: [BoxStateController],
  providers: [BoxStateService],
  imports:[
    TypeOrmModule.forFeature([ArequipaBoxes, LimaBoxes]),
  ],
  exports:[TypeOrmModule]
})
export class BoxStateModule {}
