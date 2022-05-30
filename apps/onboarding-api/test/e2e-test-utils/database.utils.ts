import { getConnection } from 'typeorm';

export async function clearDatabase() {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await repository.query(`DELETE FROM ${entity.tableName};`);
    await repository.query('SET FOREIGN_KEY_CHECKS = 1;');
  }
}
