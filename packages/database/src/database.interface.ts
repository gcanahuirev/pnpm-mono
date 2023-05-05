import { DataSourceOptions } from 'typeorm';

export interface DatasourceConfig {
  entities: DataSourceOptions['entities'];
}
