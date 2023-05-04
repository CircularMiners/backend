import {
  MineralCompositionDAO,
  SideStreamDAO,
  SideStreamDTO,
} from "../entities/sidestream_entity";
import { pool } from "../app";
import { v4 as uuidv4 } from "uuid";

export async function insertToDB(params: SideStreamDTO) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO sidestream 
        (sidestream_id, sidestream_createtime, sidestream_orename,
        sidestream_weight, sidestream_size, mine_representative_id,
        sidestream_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING 
        sidestream_id, sidestream_createtime, sidestream_orename,
        sidestream_weight, sidestream_size, mine_representative_id,
        sidestream_description`;
    const insertValues = [
      uuidv4(),
      new Date(),
      params.oreName,
      params.weight,
      params.size,
      params.mineRepresentative,
      params.description,
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
