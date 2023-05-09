
import { Guid } from "guid-typescript";

export interface MineRepresentativeDAO {
    mine_representative_id: Guid,
    mine_representative_name: string,
    mine_representative_email: string
    mine_representative_password: string,
    mine_representative_company_name: string,
    mine_representative_usertype: string,
    mine_representative_phonenumber: number
}

export interface MineRepresentativeDTO {
    mineRepresentativeName: string,
    mineRepresentativeEmail: string
    mineRepresentativePassword: string,
    mineRepresentativeCompanyname: string,
    mineRepresentativePhonenumber: number
}