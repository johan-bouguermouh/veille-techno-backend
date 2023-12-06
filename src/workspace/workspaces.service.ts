import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspaces.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  findAll(): Promise<Workspace[]> {
    return this.workspacesRepository.find();
  }

  findOne(id: number): Promise<Workspace | null> {
    return this.workspacesRepository.findOneBy({ id });
  }

  async create(workspace: Workspace): Promise<Workspace> {
    return this.workspacesRepository.save(workspace);
  }

  async remove(id: number): Promise<void> {
    await this.workspacesRepository.delete(id);
  }
}
