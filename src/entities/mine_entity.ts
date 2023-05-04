
import { Guid } from "guid-typescript";

export interface MineDAO {
    mine_id: Guid,
    mine_name: string,
    mine_location: string
    mine_description: string,
    mine_representative_id: Guid
}

export interface MineDTO {
    mineName: string,
    mineLocation: string
    mineDescription: string,
    mineRepresentativeId: string
}

