import {
  MineralCompositionDAO,
  SideStreamDAO,
  SideStreamDTO,
  SideStreamwithMineDTO,
  SideStreamwithMineralCompositionDTO,
} from "../entities/sidestream_entity";
import { pool } from "../app";
import { v4 as uuidv4 } from "uuid";

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

export async function findMineandSidestream(oreName: string) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT sidestream.sidestream_id, sidestream.sidestream_orename, sidestream.sidestream_weight,
    sidestream.sidestream_size, sidestream.sidestream_description, mine.mine_name, mine.mine_location, mine.mine_description 
     FROM sidestream LEFT JOIN mine on sidestream.mine_id = mine.mine_id
     WHERE sidestream_orename = $1`;
    const insertValues = [oreName];

    const results = await client.query(selectQuery, insertValues);

    const sidestreams: SideStreamwithMineDTO[] = results.rows.map((row) => ({
      id: row.sidestream_id,
      oreName: row.sidestream_orename,
      weight: row.sidestream_weight,
      size: row.sidestream_size,
      SidestreamDescription: row.sidestream_description,
      mineName: row.mine_name,
      mineLocation: row.mine_location,
      mineDescription: row.mine_description,
    }));
    return sidestreams;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}

//newwww
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
