import { MineDAO, MineDTO } from "../entities/mine_entity";
import { pool } from "../app";
import { Guid } from "guid-typescript";
import {v4 as uuidv4} from 'uuid';


export async function insertToDB(params: MineDTO) {

    const client = await pool.connect();

    try {
    await client.query('BEGIN');

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
    const insertValues = 
            [
                uuidv4(),
                params.mineName,
                params.mineLocation,
                params.mineDescription,
                params.mineRepresentativeId
            ];

    const { rows } = await client.query(insertQuery, insertValues);

    await client.query('COMMIT');
    if(rows.length >0){
        return rows[0] as MineDAO;
    }
    
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    
  } finally {
    client.release();
  }
}


export async function getMine(id: Guid | undefined | null, name:string, location:string, description:string, RepresentativeID: Guid | undefined | null) 
{
    const client = await pool.connect();

    try 
    {
        let getQuery:string = `
        SELECT mine_id, mine_name, mine_location, mine_description, mine_representative_id
        FROM mine 
        WHERE 1=1` ;

        if (id !== null) 
        {
            getQuery += ` AND (mine_id = '${id}') `;
        }
        if (name !== "") 
        {
            getQuery += ` AND UPPER(mine_name) = UPPER('${name}') `;
        }
        if (location !== "") 
        {
            getQuery += ` AND UPPER(mine_location) = UPPER('${location}') `;
        }
        if (description !== "") 
        {
            getQuery += ` AND UPPER(mine_description) = UPPER('${description}') `;
        }
        if (RepresentativeID !== null) 
        {
            getQuery += ` AND (mine_representative_id = '${RepresentativeID}') `;
        }
        

        const { rows } = await client.query(getQuery);
        console.log(rows);

        if(rows.length >0)
        {
            //return rows[0] as MineDAO;
            return rows.map((row: any) => row as MineDAO);
        }
        
    } 
    catch (e) 
    {
        console.error(e);
        
    } 
    finally 
    {
         client.release();
    }
}
  
