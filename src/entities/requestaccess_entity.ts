export interface RequestAccessDAO {}

export interface RequestAccessDTO {
  requestAccessMessage: string;
}

export interface RequestAccesswithRequestorDTO {
  dataRequestorId: string;
  dataRequestorName: string;
  dataRequestorEmail: string;
  dataRequestorCompanyName: string;
  requestAccessMessage: string;
  requestAccessDatetime: Date;
  requestAccessStatus: string;
  sideStreamId: string;
}
