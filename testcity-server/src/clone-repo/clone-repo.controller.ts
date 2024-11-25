import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloneRepoService } from './clone-repo.service';
import { AnalyzeSourceDto } from './dto/create-clone-repo.dto';
import { log } from 'console';


@Controller('analizy-sources')
export class CloneRepoController {
  constructor(private readonly cloneRepoService: CloneRepoService) {}

  @Get('/linkRepo')
  async create(@Body() analyzeSourceDto: AnalyzeSourceDto) {
    let sourcePath : string = '';
    const responseCloneRepository = await this.cloneRepoService.analyzeSource(analyzeSourceDto).then((res) => {
      sourcePath = res;
    });

    // console.log('Source path:', sourcePath);
    // console.log('Response:', responseCloneRepository);
    
    const reportsTest = this.cloneRepoService.getUnitTestReports(sourcePath);
    console.log('Test output:', reportsTest);
    
    return {
      message: 'Repository cloned successfully'
    };
  }

  @Get('/test')
  async getReport(){
    await this.cloneRepoService.getUnitTestReports('asd');
  }
}
