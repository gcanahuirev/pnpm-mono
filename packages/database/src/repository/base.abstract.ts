import {
  DeepPartial,
  SaveOptions,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  RemoveOptions,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';

import { BaseInterfaceRepository } from './base.interface';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>, options?: SaveOptions ): Promise<T> {
    return await this.entity.save(data, options);
  }
  public async saveMany(data: DeepPartial<T>[], options?: SaveOptions): Promise<T[]> {
    return await this.entity.save(data, options);
  }
  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
    return await this.entity.findBy(where);
  }

  public async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return await this.entity.findAndCount(options);
  }

  public async findAndCountBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<[T[], number]> {
    return await this.entity.findAndCountBy(where);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.entity.findOne(options);
  }

  public async findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
    return await this.entity.findOneBy(where);
  }

  public async remove(data: T, options?: RemoveOptions): Promise<T> {
    return await this.entity.remove(data, options);
  }

  public async removeMany(data: T[], options?: RemoveOptions): Promise<T[]> {
    return await this.entity.remove(data, options);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
    return await this.entity.preload(entityLike);
  }

  public async query(query: string, parameters?: any[]): Promise<any> {
    return await this.entity.query(query, parameters);
  }

  public createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder(alias, queryRunner);
  }
}
