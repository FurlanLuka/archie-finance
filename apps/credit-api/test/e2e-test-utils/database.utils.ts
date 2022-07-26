import { Connection } from 'typeorm';

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
