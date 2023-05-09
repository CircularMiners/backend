import { Guid } from "guid-typescript";

export interface RequestAccessDAO {}

export interface RequestAccessDTO {
  requestAccessMessage: string;
}

export interface RequestAccesswithRequestorDTO {
  dataRequestorId: Guid;
  dataRequestorName: string;
  dataRequestorEmail: string;
  dataRequestorCompanyName: string;
  requestAccessMessage: string;
  requestAccessDatetime: Date;
  requestAccessStatus: string;
  sidestreamId: Guid;
}

export interface RequestAccesswithStatusDTO {
  dataRequestorId: Guid;
  requestAccessStatus: string;
  sidestreamId: Guid;
}

export interface RequestAccesswithTimeDTO {
  dataRequestorId: Guid;
  requestAccessDatetime: Date;
  requestAccessStatus: string;
  sidestreamId: Guid;
  sidestreamName: string;
  sidestreamDescription: string;
}
