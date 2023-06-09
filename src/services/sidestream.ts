import {
  MineralCompositionDAO,
  SideStreamDAO,
  SideStreamDTO,
  SideStreamwithMineDTO,
  SideStreamwithMineralCompositionDTO,
  SideStreams,
} from "../entities/sidestream_entity";
import { pool } from "../app";
import { v4 as uuidv4 } from "uuid";
import { Guid } from "guid-typescript";

export async function insertToDB(
  params: SideStreamDTO,
  mineRepId: string,
  mineId: string
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO sidestream 
        (sidestream_id, sidestream_createtime, sidestream_orename,
        sidestream_weight, sidestream_size, mine_representative_id,
        sidestream_description, mine_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING 
        sidestream_id, sidestream_createtime, sidestream_orename,
        sidestream_weight, sidestream_size, mine_representative_id,
        sidestream_description, mine_id`;
    const insertValues = [
      uuidv4(),
      new Date(),
      params.oreName,
      params.weight,
      params.size,
      mineRepId,
      params.description,
      mineId,
    ];

    const { rows } = await client.query(insertQuery, insertValues);
    const sideStream = rows[0] as SideStreamDAO;

    await client.query("COMMIT");

    params.compositionMaterial.forEach(async (element) => {
      try {
        const insertQuery = `INSERT INTO mineralcomposition 
        (mineral_composition_id, mineral_composition_name, mineral_chemical_formula,
        sidestream_id, mineral_composition_percentage
        ) VALUES ($1, $2, $3, $4, $5 ) RETURNING 
        mineral_composition_id, mineral_composition_name, mineral_chemical_formula,
        sidestream_id, mineral_composition_percentage`;
        const insertValues = [
          uuidv4(),
          element.mineralName,
          element.mineralFormula,
          sideStream.sidestream_id,
          element.mineralPercentage,
        ];

        const { rows } = await client.query(insertQuery, insertValues);
        return rows[0] as MineralCompositionDAO;
      } catch (e) {
        console.error(e);
      }
    });
    return sideStream;
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
}

export async function findMineandSidestream(
  dataRequestorId: string,
  oreName: string
) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT sidestream.sidestream_id, sidestream.sidestream_orename, sidestream.sidestream_weight, sidestream.sidestream_size, sidestream.sidestream_description, 
    mine.mine_name, mine.mine_location, minerepresentative.mine_representative_company_name, requestaccess.request_access_status
    FROM sidestream LEFT JOIN mine on sidestream.mine_id = mine.mine_id
    LEFT JOIN requestaccess ON sidestream.sidestream_id = requestaccess.sidestream_id AND requestaccess.datarequestor_id = $1
    INNER JOIN minerepresentative on mine.mine_representative_id = minerepresentative.mine_representative_id
    WHERE sidestream.sidestream_orename ILIKE '%' || $2 || '%'`;
    const insertValues = [dataRequestorId, oreName];

    const { rows } = await client.query(selectQuery, insertValues);

    const sidestreams: SideStreamwithMineDTO[] = rows.map((row) => ({
      id: row.sidestream_id,
      meterialName: row.sidestream_orename,
      weight: row.sidestream_weight,
      size: row.sidestream_size,
      meterialDescription: row.sidestream_description,
      mineName: row.mine_name,
      mineLocation: row.mine_location,
      companyName: row.mine_representative_company_name,
      requestStatus:
        row.request_access_status == "APPROVED" ? "OPEN" : "CLOSED",
    }));
    return sidestreams;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}

//this is for the mine representative to see all the sidestreams that he/she has created
export async function getAllMineandSidestream(
  mineRepId: string,
  mineId: string
) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT sidestream.sidestream_id, sidestream.sidestream_orename, sidestream.sidestream_weight,
    sidestream.sidestream_size, sidestream.sidestream_description, mineralcomposition.mineral_composition_name, 
    mineralcomposition.mineral_chemical_formula, mineralcomposition.mineral_composition_percentage
     FROM minerepresentative INNER JOIN sidestream on minerepresentative.mine_representative_id = sidestream.mine_representative_id AND minerepresentative.mine_representative_usertype='representative'
     LEFT JOIN mineralcomposition on sidestream.sidestream_id = mineralcomposition.sidestream_id
     WHERE sidestream.mine_representative_id = '${mineRepId}' AND sidestream.mine_id = '${mineId}'`;

    const { rows } = await client.query(selectQuery);

    const sidestreams: SideStreamwithMineralCompositionDTO[] = rows.map(
      (row) => ({
        id: row.sidestream_id,
        oreName: row.sidestream_orename,
        weight: row.sidestream_weight,
        size: row.sidestream_size,
        SidestreamDescription: row.sidestream_description,
        mineralName: row.mineral_composition_name,
        mineralFormula: row.mineral_chemical_formula,
        mineralPercentage: row.mineral_composition_percentage,
      })
    );
    return sidestreams;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}

//this is for the data requestor to see one of the sidestreams that he/she has access to see
export async function getOneMineandSidestream(
  dataRequestorId: Guid,
  sidestreamId: Guid
) {
  const client = await pool.connect();
  try {
    const selectQuery = `SELECT minerepresentative.mine_representative_company_name, 
    mine.mine_name, mine.mine_location, mine.mine_description, 
    requestaccess.sidestream_id, sidestream.sidestream_orename, sidestream.sidestream_weight, sidestream.sidestream_size, sidestream.sidestream_description, 
    mineralcomposition.mineral_composition_name, mineralcomposition.mineral_chemical_formula, mineralcomposition.mineral_composition_percentage
     FROM requestaccess INNER JOIN datarequestor on requestaccess.datarequestor_id = datarequestor.datarequestor_id
     LEFT JOIN sidestream on sidestream.sidestream_id = requestaccess.sidestream_id 
     LEFT JOIN mineralcomposition on sidestream.sidestream_id = mineralcomposition.sidestream_id
     INNER JOIN mine on sidestream.mine_id = mine.mine_id
     INNER JOIN minerepresentative on mine.mine_representative_id = minerepresentative.mine_representative_id
     WHERE requestaccess.request_access_status ='APPROVED' AND requestaccess.datarequestor_id = '${dataRequestorId}' AND requestaccess.sidestream_id = '${sidestreamId}' AND datarequestor.datarequestor_usertype='requestor'`;

    const { rows } = await client.query(selectQuery);

    const sidestreams: SideStreams[] = rows.map((row) => ({
      companyName: row.mine_representative_company_name,
      mineName: row.mine_name,
      mineLocation: row.mine_location,
      mineDescription: row.mine_description,
      sidestreamId: row.sidestream_id,
      materialName: row.sidestream_orename,
      weight: row.sidestream_weight,
      size: row.sidestream_size,
      materialDescription: row.sidestream_description,
      mineralName: row.mineral_composition_name,
      mineralFormula: row.mineral_chemical_formula,
      mineralPercentage: row.mineral_composition_percentage,
    }));

    return sidestreams;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}
