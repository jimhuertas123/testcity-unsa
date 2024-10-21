import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyzeSourceDto } from './dto/create-clone-repo.dto';
import { GitService } from './services/git.service';
import { Repository as RepositoryEntity } from './entities/repository.entity';

@Injectable()
export class CloneRepoService {
  constructor(
    private readonly gitService: GitService,
    @InjectRepository(RepositoryEntity)
    private readonly repositoryRepository: Repository<RepositoryEntity>,
  ) {}

  async analyzeSource(analyzeSourceDto: AnalyzeSourceDto) {
    const sourceUrl = await this.gitService.cloneRepository(analyzeSourceDto.cloneUrl, './repositories');
    console.log(sourceUrl);

    const repository = new RepositoryEntity();
    repository.cloneUrl = analyzeSourceDto.cloneUrl;
    repository.name = "xd";
    repository.src = "./repositories";
    
    await this.repositoryRepository.save(repository);
  }
}
