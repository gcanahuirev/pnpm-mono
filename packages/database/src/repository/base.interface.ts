import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, QueryRunner, RemoveOptions, SaveOptions, SelectQueryBuilder } from 'typeorm';

export interface BaseInterfaceRepository<T extends ObjectLiteral> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>, options?: SaveOptions): Promise<T>;
  saveMany(data: DeepPartial<T>[], options?: SaveOptions): Promise<T[]>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  findAndCountBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<[T[], number]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null>;
  remove(data: T, options?: RemoveOptions): Promise<T>;
  removeMany(data: T[], options?: RemoveOptions): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T | undefined>;
  query(query: string, parameters?: any[]): Promise<any>;
  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T>;
}
