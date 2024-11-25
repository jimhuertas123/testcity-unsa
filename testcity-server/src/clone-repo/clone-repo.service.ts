import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyzeSourceDto } from './dto/create-clone-repo.dto';
import { GitService } from './services/git.service';
import { Repository as RepositoryEntity } from './entities/repository.entity';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';


//aux function to promisify exec 
const execAsync = promisify(exec);

@Injectable()
export class CloneRepoService {
  constructor(
    private readonly gitService: GitService,
    @InjectRepository(RepositoryEntity)
    private readonly repositoryRepository: Repository<RepositoryEntity>,
  ) {}

  async analyzeSource(analyzeSourceDto: AnalyzeSourceDto): Promise<string> {

    const responseGitCLone = await this.gitService.cloneRepository(analyzeSourceDto.cloneUrl, './repositories');
    
    if(responseGitCLone.error !== ''){
      throw new BadRequestException(`${responseGitCLone.error}`);
    }
    
    const repository = new RepositoryEntity();
    repository.reportId = responseGitCLone.id;
    repository.cloneUrl = analyzeSourceDto.cloneUrl;
    repository.name = responseGitCLone.name;
    repository.src = responseGitCLone.localPath;
    
    await this.repositoryRepository.save(repository).then((res) => {
      return res.src;
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    return repository.src;
  }

  async getUnitTestReports(sourcePath: string): Promise<void> {
    
    //cobertura de codigo (verificacion)

    
    const results = await execAsync( 'npm i' , { cwd: 'repositories/example19ed5bc2571f335e8be31f72a3678e244a1a39b23/' } );
    const { stdout, stderr } = await execAsync('npm run test:coverage', { cwd: 'repositories/example19ed5bc2571f335e8be31f72a3678e244a1a39b23/' });

    //extraccion de los reportes de test
    const reports = await this.parseCoverageReport(stdout);
    console.log('Test output Packages:', results.stdout);
    console.log('Test output:', reports);


    //source code analyzer
    const srcComponents = await this.analyzeSourceCode('repositories/example19ed5bc2571f335e8be31f72a3678e244a1a39b23/');
    // console.log('Source code components:', srcComponents);
    srcComponents.forEach((fileComp: {file: string, components: {name:any, startLine: any, endLine:any}}) => {
      console.log('Component:', fileComp.file);
      console.log('Component:', fileComp.components);
      // console.log('Start Line:', fileComp.components.startLine);
      // console.log('End Line:', fileComp.components.endLine);
    });

    if (stderr) {
      console.error('Test errors:', stderr);
    }
  }





  async identifyTestLibrary(sourcePath: string): Promise<string> {
    const packageJsonPath = path.join(sourcePath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new BadRequestException('package.json not found in the specified source path');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (packageJson.devDependencies) {
      if (packageJson.devDependencies.mocha) {
        return 'mocha';
      } else if (packageJson.devDependencies.jest) {
        return 'jest';
      }
    }

    throw new BadRequestException('No known test library found in package.json');
  }

  async hasCoverageScript(sourcePath: string): Promise<string> {
    const packageJsonPath = path.join(sourcePath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new BadRequestException('package.json not found in the specified source path');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (packageJson.scripts && packageJson.scripts['test:coverage']) {
      return "test:coverage";
    }
    if (packageJson.scripts && packageJson.scripts['test']) {
      return "test";
    }

    throw new BadRequestException('No script with test in the package.json');;
  }

  async getCoverageReport(sourcePath: string): Promise<void> {
    const coverageScript = await this.hasCoverageScript(sourcePath);
    const { stdout, stderr } = await execAsync(`npm run ${coverageScript}`, { cwd: sourcePath });

    console.log('Coverage output:', stdout);
    if (stderr) {
      console.error('Coverage errors:', stderr);
    }
  }


  //aux function to parse the coverage report
  async parseCoverageReport(report: string): Promise<any> {
    const lines = report.split('\n');
    const summaryIndex = lines.findIndex(line => line.includes('Coverage summary'));
    const summaryLines = lines.slice(summaryIndex + 1, summaryIndex + 5);

    const summary = summaryLines.reduce((acc, line) => {
      const [key, value] = line.split(':').map(part => part.trim());
      acc[key.toLowerCase()] = parseFloat(value.split(' ')[0]);
      return acc;
    }, {});

    const fileCoverageIndex = lines.findIndex(line => line.startsWith('File'));
    const fileCoverageLines = lines.slice(fileCoverageIndex + 2, summaryIndex - 1);

    const fileCoverage = fileCoverageLines.map(line => {
      const [file, stmts, branch, funcs, lines, uncovered] = line.split('|').map(part => part.trim());
      return {
        file,
        stmts: parseFloat(stmts),
        branch: parseFloat(branch),
        funcs: parseFloat(funcs),
        lines: parseFloat(lines),
        uncovered: uncovered ? uncovered.split(',').map(num => parseInt(num.trim())) : []
      };
    });

    return {
      summary,
      fileCoverage
    };
  }

  async analyzeSourceCode(sourcePath: string): Promise<any> {
    const files = [
      ...(await this.getFilesInDirectory(sourcePath, '.ts')),
      ...(await this.getFilesInDirectory(sourcePath, '.js'))
    ];
    const analysisResults = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      const components = this.identifyComponents(lines);

      analysisResults.push({
      file,
      components
      });
    }

    return analysisResults;
  }
  
  identifyComponents(lines: string[]): { name: string, startLine: number, endLine: number, attributes: number, methods: number }[] {
    const components = [];
    let currentComponent = null;
  
    lines.forEach((line, index) => {
      const classMatch = line.match(/class\s+(\w+)/);
      const nestInjectableMatch = line.match(/@Injectable\(\)/);
      const reactComponentMatch = line.match(/function\s+(\w+)/);
      const reactConstComponentMatch = line.match(/const\s+(\w+)\s*[:=]/);
      const angularComponentMatch = line.match(/@Component\(\{/);
  
      if (classMatch || nestInjectableMatch || reactComponentMatch || reactConstComponentMatch || angularComponentMatch) {
        if (currentComponent) {
          currentComponent.endLine = index;
          components.push(currentComponent);
        }
  
        currentComponent = {
          name: classMatch ? classMatch[1] : reactComponentMatch ? reactComponentMatch[1] : reactConstComponentMatch ? reactConstComponentMatch[1] : 'Anonymous',
          startLine: index + 1,
          endLine: lines.length,
          attributes: 0,
          methods: 0
        };
      }
  
      if (currentComponent) {
        const attributeMatch = line.match(/^\s*(const|let|var)\s+\w+/);
        const methodMatch = line.match(/^\s*(async\s+)?\w+\s*\(.*\)\s*{/);
        const anonymousFunctionMatch = line.match(/^\s*(const|let|var)\s+\w+\s*=\s*(async\s*)?\(.*\)\s*=>\s*{/);
  
        if (attributeMatch) {
          currentComponent.attributes++;
        }
  
        if (methodMatch || anonymousFunctionMatch) {
          currentComponent.methods++;
        }
      }
    });
  
    if (currentComponent) {
      currentComponent.endLine = lines.length;
      components.push(currentComponent);
    }
  
    return components;
  }
  
  
  identifyComponentsOld(lines: string[]): { name: string, startLine: number, endLine: number }[] {
    const components = [];
    let currentComponent = null;

    lines.forEach((line, index) => {
      const classMatch = line.match(/class\s+(\w+)/);
      const nestInjectableMatch = line.match(/@Injectable\(\)/);
      const reactComponentMatch = line.match(/function\s+(\w+)/);
      const reactConstComponentMatch = line.match(/const\s+(\w+)\s*[:=]/);
      const angularComponentMatch = line.match(/@Component\(\{/);

      if (classMatch || nestInjectableMatch || reactComponentMatch || reactConstComponentMatch || angularComponentMatch) {
        if (currentComponent) {
          currentComponent.endLine = index;
          components.push(currentComponent);
        }

        currentComponent = {
          name: classMatch ? classMatch[1] : reactComponentMatch ? reactComponentMatch[1] : reactConstComponentMatch ? reactConstComponentMatch[1] : 'Anonymous',
          startLine: index + 1,
          endLine: lines.length
        };
      }
    });

    if (currentComponent) {
      currentComponent.endLine = lines.length;
      components.push(currentComponent);
    }

    return components;
  }

  async getFilesInDirectory(dir: string, ext: string): Promise<string[]> {
    const ignoreDirs = ['node_modules', 'dist', '.idea', '.git', 'coverage', '.vscode', 'build', '.nyc_output', 'test', 'tests'];
    const files = fs.readdirSync(dir);
    let fileList = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(file)) {
          const nestedFiles = await this.getFilesInDirectory(filePath, ext);
          fileList = fileList.concat(nestedFiles);
        }
      } else if (filePath.endsWith(ext)) {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  
}

