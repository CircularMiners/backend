import { Guid } from "guid-typescript";

export interface SideStreamDAO {
  sidestream_id: Guid;
  sidestream_createtime: Date;
  sidestream_orename: string;
  sidestream_weight: number;
  sidestream_size: number;
  mine_representative_id: Guid;
  sidestream_description: string;
}

export interface MineralCompositionDAO {
  mineral_composition_id: Guid;
  mineral_composition_name: string;
  mineral_chemical_formula: string;
  sidestream_id: Guid;
  mineral_composition_percentage: number;
}

export interface SideStreamDTO {
  oreName: string;
  description: string;
  weight: number;
  size: number;
  mineRepresentative: Guid;
  compositionMaterial: MineComposition[];
}

interface MineComposition {
  mineralFormula: string;
  mineralName: string;
  mineralPercentage: number;
}
