import { DataRequestorDAO, DataRequestorDTO } from "../entities/datarequestor_entity";
import { pool } from "../app";
import { Guid } from "guid-typescript";
import {v4 as uuidv4} from 'uuid';


export async function insertToDB_DataReq(params: DataRequestorDTO) {

    const client = await pool.connect();

    try {
    await client.query('BEGIN');

    const insertQuery = `INSERT INTO datarequestor 
        (datarequestor_id,
        datarequestor_name, 
        datarequestor_email,
        datarequestor_password,
        datarequestor_company_name,
        datarequestor_usertype
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING 
        datarequestor_id, datarequestor_name, 
        datarequestor_email, datarequestor_company_name,
        datarequestor_usertype`;
    const insertValues = [
        uuidv4(),
        params.dataRequestorName,
        params.dataRequestorEmail,
        params.dataRequestorPassword,
        params.dataRequestorCompanyname,
        "requestor"
            ];

    const { rows } = await client.query(insertQuery, insertValues);

    await client.query('COMMIT');
    if(rows.length >0){
        return rows[0] as DataRequestorDAO;
    }
    
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    
  } finally {
    client.release();
  }
}

export async function getDataRequestor(id: Guid) {
  const client = await pool.connect();

    try {

    const getQuery = `SELECT * FROM datarequestor WHERE datarequestor_id='${id}'`;
    

    const { rows } = await client.query(getQuery);
    console.log(rows);
   if(rows.length >0){
        return rows[0] as DataRequestorDAO;
    }
    
  } catch (e) {
    console.error(e);
    
  } finally {
    client.release();
  }
}
  
