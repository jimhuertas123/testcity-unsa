import { BadRequestException, Injectable } from '@nestjs/common';
import simpleGit, { SimpleGit } from 'simple-git';

interface CloneResult {
  localPath: string;
  id: string;
  name: string;
  
  //for kwnwing the proccedings purpose
  error: string;
}

@Injectable()
export class GitService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async cloneRepository(repoUrl: string, localPath: string): Promise<CloneResult> {
    try {
      const result: CloneResult = {
        localPath: '',
        id: '',
        name: '',
        error: ''
      };
      const repoInfo = await this.git.listRemote(['--refs', repoUrl]);
      if (!repoInfo) {
         result.error = 'Repository does not exist';
        return Promise.resolve(result);
      }

      const sizeInfo = await this.git.raw(['ls-remote', '--symref', repoUrl]);
      const sizeMatch = sizeInfo.match(/size: (\d+)/);
      const repoSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 0;

      if (repoSize > 90 * 1024 * 1024) {
        result.error = 'Repository size exceeds 90MB.'
        return Promise.resolve(result);
      }

      const isJsTsProject = await this.git.raw(['ls-tree', '-r', 'HEAD', '--name-only']);
      if (!isJsTsProject.includes('.js') && !isJsTsProject.includes('.ts')) {
        result.error = 'The repository is not a JavaScript/TypeScript project.'
        return Promise.resolve(result);
      }

      const hasTestFolder = await this.git.raw(['ls-tree', '-d', 'HEAD', '--name-only']);
      if (!hasTestFolder.includes('test') || hasTestFolder.includes('tests')) {
        result.error = 'The repository does not contain a test/ or tests/ folder.'
        return Promise.resolve(result);
      }
      
      const commitId = await this.git.revparse(['HEAD']);
      result.id = commitId;

      const projectNameMatch = repoUrl.match(/\/([^\/]+)\.git$/);
      const projectName = projectNameMatch ? projectNameMatch[1] : 'unknown';
      result.name = projectName;

      await this.git.clone(repoUrl, `${localPath}/${projectName}${commitId}`);
      result.localPath = `${localPath}/${projectName}${commitId}`;


      console.log(`Repository cloned to ${localPath}/${commitId}`);
      console.log(repoInfo);
      return Promise.resolve(result);
    } catch (error) {
        console.error('Error cloning repository:', error);
        return Promise.reject(error);
    }
  }
}