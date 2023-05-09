import {LoginDTO } from "../entities/login_entity";
import { pool } from "../app";

export async function checkCredentials(params: LoginDTO) {

const userType = params.userType;
const email = params.userEmail;
const password = params.userPassword;


  if (userType =='representative'){
    const selectQuery1 = `SELECT mine_representative_id FROM minerepresentative WHERE mine_representative_email = '${email}' AND mine_representative_password = '${password}'`;
    const {rows} = await pool.query(selectQuery1);
    if(rows.length >0){
      // return rows[0];
      return { status: 'validated', id: rows[0].mine_representative_id || rows[0].datarequestor_id }
  }
  else{
    return { status: 'invalid' }
  }
  }else if (userType == 'requestor'){
    const selectQuery2 = `SELECT datarequestor_id FROM datarequestor WHERE datarequestor_email = '${email}' AND datarequestor_password = '${password}'`;
    const {rows} = await pool.query(selectQuery2);
    if(rows.length >0){
      // return rows[0];
      return { status: 'validated', id: rows[0].mine_representative_id || rows[0].datarequestor_id }
  }
  else{
    return { status: 'invalid' }
  }
  }


}
