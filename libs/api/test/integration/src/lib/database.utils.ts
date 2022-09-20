import { Connection, DataSource } from 'typeorm';

/**
 * @deprecated
 */
export async function clearDatabase(connection: Connection) {
  const entities = connection.entityMetadatas;
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(
      `ALTER TABLE ${entity.tableName} DISABLE TRIGGER ALL;`,
    );
    await repository.query(`DELETE FROM ${entity.tableName};`);
    await repository.query(
      `ALTER TABLE ${entity.tableName} ENABLE TRIGGER ALL;`,
    );
  }
}

export const truncateDatabase = async (
  dataSource: DataSource,
): Promise<void> => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(
      `ALTER TABLE ${entity.tableName} DISABLE TRIGGER ALL;`,
    );
    await repository.query(`DELETE FROM ${entity.tableName};`);
    await repository.query(
      `ALTER TABLE ${entity.tableName} ENABLE TRIGGER ALL;`,
    );
  }
};

export interface TestDatabase {
  databaseName: string;
  debug: boolean;
}

export const createTestDatabase = async (
  debug = false,
): Promise<TestDatabase> => {
  const { TYPEORM_HOST, TYPEORM_PASSWORD, TYPEORM_USERNAME, TYPEORM_PORT } =
    process.env;

  if (
    TYPEORM_HOST === undefined ||
    TYPEORM_PASSWORD === undefined ||
    TYPEORM_USERNAME === undefined ||
    TYPEORM_PORT === undefined
  ) {
    throw new Error('INVALID_TEST_DATABASE_CREDENTIALS');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: TYPEORM_HOST,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    port: Number(TYPEORM_PORT),
  });

  await dataSource.initialize();

  const databaseName = `testdb${Date.now()}`;

  if (debug) {
    console.log(`Creating database with name: ${databaseName}`);
  }

  await dataSource.query(`CREATE DATABASE ${databaseName}`);

  await dataSource.destroy();

  process.env['TYPEORM_DATABASE'] = databaseName;

  return {
    databaseName,
    debug,
  };
};

export const deleteTestDatabase = async (
  testDatabase: TestDatabase,
): Promise<void> => {
  const { TYPEORM_HOST, TYPEORM_PASSWORD, TYPEORM_USERNAME, TYPEORM_PORT } =
    process.env;

  if (
    TYPEORM_HOST === undefined ||
    TYPEORM_PASSWORD === undefined ||
    TYPEORM_USERNAME === undefined ||
    TYPEORM_PORT === undefined
  ) {
    throw new Error('INVALID_TEST_DATABASE_CREDENTIALS');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: TYPEORM_HOST,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    port: Number(TYPEORM_PORT),
  });

  await dataSource.initialize();

  await dataSource.query(`DROP DATABASE ${testDatabase.databaseName}`);

  await dataSource.destroy();
};
