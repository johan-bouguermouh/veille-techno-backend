import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findRoleByUserId(userId: number): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: {
        users: {
          id: userId,
        },
      },
    });
  }

  findOne(id: number): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: {
        id,
      },
    });
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
