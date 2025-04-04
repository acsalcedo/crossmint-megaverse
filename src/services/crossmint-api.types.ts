import { Color, Direction, Megaverse, MegaverseObjectType } from '../megaverse.entity';

export const ComethDirectionMap: Record<string, Direction> = {
  'UP_COMETH': 'up',
  'DOWN_COMETH': 'down',
  'LEFT_COMETH': 'left',
  'RIGHT_COMETH': 'right'
};

export const SoloonColorMap: Record<string, Color> = {
  'BLUE_SOLOON': 'blue',
  'RED_SOLOON': 'red',
  'PURPLE_SOLOON': 'purple',
  'WHITE_SOLOON': 'white',
};

export const MegaverseObjectTypeToEndpointResourceName: Record<MegaverseObjectType.POLYANET | MegaverseObjectType.COMETH | MegaverseObjectType.SOLOON, string> = {
  [MegaverseObjectType.POLYANET]: 'polyanets',
  [MegaverseObjectType.COMETH]: 'comeths',
  [MegaverseObjectType.SOLOON]: 'soloons',
};

export type MegaverseApiObject = 'SPACE' | 'POLYANET' | 'UP_COMETH' | 'DOWN_COMETH' | 'LEFT_COMETH' | 'RIGHT_COMETH' | 'WHITE_SOLOON' | 'BLUE_SOLOON' | 'RED_SOLOON' | 'PURPLE_SOLOON' ;
export type MegaverseApi = MegaverseApiObject[][];

interface CreateInputBase {
  type: MegaverseObjectType,
  row: number,
  column: number,
}

export interface CreatePolyanetInput extends CreateInputBase {
  type: MegaverseObjectType.POLYANET
}

export interface CreateComethInput  extends CreateInputBase {
  type: MegaverseObjectType.COMETH,
  direction: Direction
}

export interface CreateSoloonInput extends CreateInputBase {
  type: MegaverseObjectType.SOLOON,
  color: Color
}

export type CreateMegaverseObjectInput = CreatePolyanetInput | CreateComethInput | CreateSoloonInput;


export interface MegaverseAPIService {
  getGoalMap(): Promise<Megaverse>;
  createMegaverseObject(input: CreateMegaverseObjectInput): Promise<void>;
  deleteMegaverseObject(input: { type: MegaverseObjectType, row: number, column: number }): Promise<void> 
}