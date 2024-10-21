import { Module } from '@nestjs/common';
import { CloneRepoService } from './clone-repo.service';
import { CloneRepoController } from './clone-repo.controller';
import { GitService } from './services/git.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './entities/repository.entity';

@Module({
  controllers: [CloneRepoController],
  providers: [GitService, CloneRepoService],
  imports: [
    GitService,
    TypeOrmModule.forFeature([Repository]),
  ],
  
})
export class CloneRepoModule {}
