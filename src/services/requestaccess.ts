import { pool } from "../app";
import { v4 as uuidv4 } from "uuid";
import {
  RequestAccessDTO,
  RequestAccesswithRequestorDTO,
  RequestAccesswithStatusDTO,
  RequestAccesswithTimeDTO,
} from "../entities/requestaccess_entity";
import { Guid } from "guid-typescript";

export async function insertToDB(
  dataRequestorId: string,
  sideStreamId: string,
  message: RequestAccessDTO
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO requestaccess 
        (request_access_id,
        request_access_message,
        request_access_datetime,
        request_access_status,
        sidestream_id,
        mine_representative_id,
        datarequestor_id
        ) VALUES ($1, $2, $3, $4, $5, (SELECT mine_representative_id FROM sidestream where sidestream_id ='${sideStreamId}'), $6) RETURNING 
        request_access_id,request_access_message,request_access_datetime,request_access_status,
        sidestream_id,mine_representative_id,datarequestor_id ON CONFLICT (sidestream_id, datarequestor_id) DO NOTHING`;
    const insertValues = [
      uuidv4(),
      message.requestAccessMessage,
      new Date(),
      "PENDING",
      sideStreamId,
      dataRequestorId,
    ];

    const { rows } = await client.query(insertQuery, insertValues);

    await client.query("COMMIT");
    if (rows.length > 0) {
      return rows[0];
    }
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
}

export async function getAllAccessRequest(mineRepId: Guid) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT requestaccess.datarequestor_id,requestaccess.request_access_message, requestaccess.request_access_datetime, requestaccess.request_access_status, requestaccess.sidestream_id,
        datarequestor.datarequestor_name, datarequestor.datarequestor_email, datarequestor.datarequestor_company_name  
        FROM requestaccess LEFT JOIN datarequestor ON requestaccess.datarequestor_id = datarequestor.datarequestor_id
        WHERE requestaccess.mine_representative_id = '${mineRepId}'`;
    const { rows } = await client.query(selectQuery);

    const requestaccess: RequestAccesswithRequestorDTO[] = rows.map((row) => ({
      dataRequestorId: row.datarequestor_id,
      dataRequestorName: row.datarequestor_name,
      dataRequestorEmail: row.datarequestor_email,
      dataRequestorCompanyName: row.datarequestor_company_name,
      requestAccessMessage: row.request_access_message,
      requestAccessDatetime: row.request_access_datetime,
      requestAccessStatus: row.request_access_status,
      sidestreamId: row.sidestream_id,
    }));
    return requestaccess;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}

export async function getOneAccessRequest(
  mineRepId: Guid,
  dataRequestorId: string
) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT requestaccess.datarequestor_id,requestaccess.request_access_message, requestaccess.request_access_datetime, requestaccess.request_access_status, requestaccess.sidestream_id,
            datarequestor.datarequestor_name, datarequestor.datarequestor_email, datarequestor.datarequestor_company_name,
            sidestream.sidestream_orename, sidestream.sidestream_description
            FROM requestaccess LEFT JOIN datarequestor ON requestaccess.datarequestor_id = datarequestor.datarequestor_id
            LEFT JOIN sidestream ON requestaccess.sidestream_id = sidestream.sidestream_id
            WHERE requestaccess.mine_representative_id = '${mineRepId}' AND requestaccess.datarequestor_id = '${dataRequestorId}'`;
    const { rows } = await client.query(selectQuery);

    const requestaccess = {
      dataRequestorId: rows[0].datarequestor_id,
      dataRequestorName: rows[0].datarequestor_name,
      dataRequestorEmail: rows[0].datarequestor_email,
      dataRequestorCompanyName: rows[0].datarequestor_company_name,
      requestAccessMessage: rows[0].request_access_message,
      requestAccessDatetime: rows[0].request_access_datetime,
      requestAccessStatus: rows[0].request_access_status,
      sidestreamId: rows[0].sidestream_id,
      sidestreamName: rows[0].sidestream_orename,
      sidestreamDescription: rows[0].sidestream_description,
    };

    return requestaccess;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}

export async function updateAccessRequest(
  mineRepId: string,
  params: RequestAccesswithStatusDTO
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateQuery = `UPDATE requestaccess SET request_access_status = '${params.requestAccessStatus}' WHERE mine_representative_id = '${mineRepId}' AND datarequestor_id = '${params.dataRequestorId}' AND sidestream_id = '${params.sidestreamId}'`;

    await client.query(updateQuery);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
  }
}

export async function getAllAccessRequestForDataRequestor(
  dataRequestorId: Guid
) {
  const client = await pool.connect();

  try {
    const selectQuery = `SELECT requestaccess.datarequestor_id, requestaccess.request_access_datetime, requestaccess.request_access_status, requestaccess.sidestream_id,
        sidestream.sidestream_orename, sidestream.sidestream_description
        FROM requestaccess LEFT JOIN sidestream ON requestaccess.sidestream_id = sidestream.sidestream_id
        WHERE requestaccess.datarequestor_id = '${dataRequestorId}'`;
    const { rows } = await client.query(selectQuery);

    const requestaccess: RequestAccesswithTimeDTO[] = rows.map((row) => ({
      dataRequestorId: row.datarequestor_id,
      requestAccessDatetime: row.request_access_datetime,
      requestAccessStatus: row.request_access_status,
      sidestreamId: row.sidestream_id,
      sidestreamName: row.sidestream_orename,
      sidestreamDescription: row.sidestream_description,
    }));
    return requestaccess;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
}
