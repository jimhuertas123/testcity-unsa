import { Injectable } from '@nestjs/common';
import simpleGit, { SimpleGit } from 'simple-git';

@Injectable()
export class GitService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async cloneRepository(repoUrl: string, localPath: string): Promise<void> {
    try {
        const repoInfo = await this.git.listRemote(['--refs', repoUrl]);
        if (!repoInfo) {
            throw new Error('Repository does not exist.');
        }

        const sizeInfo = await this.git.raw(['ls-remote', '--symref', repoUrl]);
        const sizeMatch = sizeInfo.match(/size: (\d+)/);
        const repoSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 0;

        if (repoSize > 90 * 1024 * 1024) {
            throw new Error('Repository size exceeds 90MB.');
        }

        await this.git.clone(repoUrl, localPath);

        const isJsTsProject = await this.git.raw(['ls-tree', '-r', 'HEAD', '--name-only']);
        if (!isJsTsProject.includes('.js') && !isJsTsProject.includes('.ts')) {
            throw new Error('The repository is not a JavaScript/TypeScript project.');
        }
        console.log(`Repository cloned to ${localPath}`);
        console.log(repoInfo);
        
    } catch (error) {
        console.error('Error cloning repository:', error);
        return Promise.reject(error);
    }
  }
}