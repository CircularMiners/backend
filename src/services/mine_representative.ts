import {
  MineRepresentativeDAO,
  MineRepresentativeDTO,
} from "../entities/mine_rep_entity";
import { pool } from "../app";
import { Guid } from "guid-typescript";
import { v4 as uuidv4 } from "uuid";

export async function insertToDB(
  params: MineRepresentativeDTO,
  encryptedPassword: string
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const selectQuery = `SELECT mine_representative_id FROM minerepresentative WHERE mine_representative_email = '${params.mineRepresentativeEmail}'`;
    const result = await pool.query(selectQuery);
    if (result.rows.length == 0) {
      const insertQuery = `INSERT INTO minerepresentative 
        (mine_representative_id,
        mine_representative_name, 
        mine_representative_email,
        mine_representative_password,
        mine_representative_company_name,
        mine_representative_usertype,
        mine_representative_phonenumber
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING 
        mine_representative_id, mine_representative_name, 
        mine_representative_email, mine_representative_company_name,
        mine_representative_usertype, mine_representative_phonenumber`;
      const insertValues = [
        uuidv4(),
        params.mineRepresentativeName,
        params.mineRepresentativeEmail,
        encryptedPassword,
        params.mineRepresentativeCompanyname,
        "representative",
        params.mineRepresentativePhonenumber,
      ];

      const { rows } = await client.query(insertQuery, insertValues);

      await client.query("COMMIT");
      if (rows.length > 0) {
        return rows[0] as MineRepresentativeDAO;
      }
    } else {
      return { message: "User already exists" };
    }
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
}

export async function getMineRepresentative(id: Guid) {
  const client = await pool.connect();

  try {
    const getQuery = `SELECT * FROM minerepresentative WHERE mine_representative_id='${id}'`;

    const { rows } = await client.query(getQuery);
    if (rows.length > 0) {
      return rows[0] as MineRepresentativeDAO;
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}
