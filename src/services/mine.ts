import { MineDAO, MineDTO } from "../entities/mine_entity";
import { pool } from "../app";
import { Guid } from "guid-typescript";
import { v4 as uuidv4 } from "uuid";

export async function insertToDB(params: MineDTO) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO mine 
        (
            mine_id, 
            mine_name, 
            mine_location, 
            mine_description,
            mine_representative_id
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING 
            mine_id, 
            mine_name, 
            mine_location, 
            mine_description,
            mine_representative_id`;
    const insertValues = [
      uuidv4(),
      params.mineName,
      params.mineLocation,
      params.mineDescription,
      params.mineRepresentativeId,
    ];

    const { rows } = await client.query(insertQuery, insertValues);

    await client.query("COMMIT");
    if (rows.length > 0) {
      return rows[0] as MineDAO;
    }
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
}

export async function getMine(RepresentativeID: Guid) {
  const client = await pool.connect();

  try {
    let getQuery: string = `
        SELECT mine_id, mine_name, mine_location, mine_description, mine_representative_id
        FROM mine 
        WHERE mine_representative_id = '${RepresentativeID}'`;

    const { rows } = await client.query(getQuery);

    if (rows.length > 0) {
      return rows.map((row: any) => row as MineDAO);
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}
