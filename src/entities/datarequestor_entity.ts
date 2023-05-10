import { Guid } from "guid-typescript";

export interface DataRequestorDAO {
    datarequestor_id: Guid,
    datarequestor_name: string,
    datarequestor_email: string
    datarequestor_password: string,
    datarequestor_company_name: string,
    datarequestor_usertype: string
}

export interface DataRequestorDTO {
    dataRequestorName: string,
    dataRequestorEmail: string
    dataRequestorPassword: string,
    dataRequestorCompanyname: string
}