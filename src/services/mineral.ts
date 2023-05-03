import { MineralDAO, MineralDTO } from "../entities/mineral_entity";
import { pool } from "../app";


export async function insertToDB(params: MineralDTO) {

	const client = await pool.connect();

	try {
	await client.query('BEGIN');

	const insertQuery = `
        INSERT INTO minerepresentative 
		(
			mineral_chemical_formula,
			mineral_chemical_name, 
			mineral_name
		) 
		VALUES 
		(
			$1, 
			$2, 
			$3
		) 
		RETURNING 
		mineral_chemical_formula,
        mineral_chemical_name, 
        mineral_name
    `;
	const insertValues = 
    [
		params.mineralChemicalFormula,
		params.mineralChemicalName,
		params.mineralName
	];

	const { rows } = await client.query(insertQuery, insertValues);

	await client.query('COMMIT');
	if(rows.length >0){
		return rows[0] as MineralDAO;
	}
	
  } catch (e) {
	await client.query('ROLLBACK');
	console.error(e);
	
  } finally {
	client.release();
  }
}

export async function getMineral(chemicalFormula:string, chemicalName:string, normalName:string) {
  const client = await pool.connect();

	try {

	let getQuery:string = `
    SELECT mineral_chemical_formula, mineral_chemical_name, mineral_name
    FROM mineral 
    WHERE 1=1` ;

    if (chemicalFormula !== "") 
    {
        getQuery += ` AND (UPPER(mineral_chemical_formula) = UPPER(:${chemicalFormula})) `;
    }
    if (chemicalName !== "") 
    {
        getQuery += ` AND (UPPER(mineral_chemical_name) = UPPER(:${chemicalName})) `;
    }
    if (normalName !== "") 
    {
        getQuery += ` AND (UPPER(mineral_name) = UPPER(:${normalName})) `;
    }
	

	const { rows } = await client.query(getQuery);
    if(rows.length >0){
		return rows[0] as MineralDAO;
	}
	
  } catch (e) {
	await client.query('ROLLBACK');
	console.error(e);
	
  } finally {
	client.release();
  }
}
  
