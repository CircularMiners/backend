import { MineRepresentativeDAO, MineRepresentativeDTO } from "../entities/user_entity";
import { pool } from "../app";
import { v4 as uuidv4 } from 'uuid';



export async function insertToDB(params: MineRepresentativeDTO) {

    const client = await pool.connect();

    try {
    await client.query('BEGIN');

    const insertQuery = `INSERT INTO minerepresentative 
        (mine_representative_id,
        mine_representative_name, 
        mine_representative_email,
        mine_representative_password,
        mine_representative_company_name,
        mine_representative_usertype,
        mine_representative_phonenumber
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING 
        mine_representative_id, mine_representative_name, 
        mine_representative_email, mine_representative_company_name,
        mine_representative_usertype, mine_representative_phonenumber`;
    const insertValues = [
        uuidv4(),
        params.mineRepresentativeName,
        params.mineRepresentativeEmail,
        params.mineRepresentativePassword,
        params.mineRepresentativeCompanyname,
        params.mineRepresentativeUsertype,
        params.mineRepresentativePhonenumber
            ];

    const { rows } = await client.query(insertQuery, insertValues);

    await client.query('COMMIT');
    if(rows.length >0){
        return rows[0] as MineRepresentativeDAO;
    }
    
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    
  } finally {
    client.release();
  }
}
  
