import { LoginDTO } from "../entities/login_entity";
import { pool } from "../app";
import { comparePasswords } from "../utils/constants";

export async function checkCredentials(params: LoginDTO) {
  if (params.userType == "representative") {
    const selectQuery1 = `SELECT mine_representative_id, mine_representative_password FROM minerepresentative WHERE mine_representative_email = '${params.userEmail}'`;
    const { rows } = await pool.query(selectQuery1);
    if (rows.length > 0) {
      // compare passwords
      const isMatch = await comparePasswords(
        params.userPassword,
        rows[0].mine_representative_password
      );
      if (isMatch) {
        return { message: "validated", id: rows[0].mine_representative_id };
      } else {
        return { message: "Invalid Password" };
      }
    } else {
      return { message: "Invalid User" };
    }
  } else if (params.userType == "requestor") {
    const selectQuery2 = `SELECT datarequestor_id, datarequestor_password FROM datarequestor WHERE datarequestor_email = '${params.userEmail}'`;
    const { rows } = await pool.query(selectQuery2);
    if (rows.length > 0) {
      // compare passwords
      const isMatch = await comparePasswords(
        params.userPassword,
        rows[0].datarequestor_password
      );
      if (isMatch) {
        return { message: "validated", id: rows[0].datarequestor_id };
      } else {
        return { message: "Invalid Password" };
      }
    } else {
      return { message: "Invalid User" };
    }
  }
}
