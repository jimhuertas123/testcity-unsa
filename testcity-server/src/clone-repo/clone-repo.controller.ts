import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloneRepoService } from './clone-repo.service';
import { AnalyzeSourceDto } from './dto/create-clone-repo.dto';


@Controller('analizy-sources')
export class CloneRepoController {
  constructor(private readonly cloneRepoService: CloneRepoService) {}

  @Get('/linkRepo')
  create(@Body() analyzeSourceDto: AnalyzeSourceDto) {
    return { 
      "source_path" : this.cloneRepoService.analyzeSource(analyzeSourceDto)
    };
  }
}
