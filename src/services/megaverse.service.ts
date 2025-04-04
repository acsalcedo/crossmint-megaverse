import { Megaverse, MegaverseObject, MegaverseObjectType } from '../megaverse.entity';
import { CreateMegaverseObjectInput, MegaverseAPIService } from './crossmint-api.types';

export class MegaverseService {
  constructor(private megaverseAPI: MegaverseAPIService) {}

  async createMegaverse() {
    const megaverse = await this.megaverseAPI.getGoalMap();
    
    for (const [i, row] of megaverse.entries()) {
      for (const [j, obj] of row.entries()) {
        const createInput = this.mapToCreateInput(obj, i, j);
          
        if (createInput && this.canBeCreated(obj, megaverse, i, j)) {
          await this.megaverseAPI.createMegaverseObject(createInput);
        }
      }
    }
  }

  private mapToCreateInput(obj: MegaverseObject, row: number, column: number): CreateMegaverseObjectInput  {
    switch (obj.type) {
    case MegaverseObjectType.POLYANET:
      return { row, column, type: MegaverseObjectType.POLYANET };
    case MegaverseObjectType.COMETH:
      return { row, column, type: MegaverseObjectType.COMETH, direction: obj.direction };
    case MegaverseObjectType.SOLOON:
      return { row, column, type: MegaverseObjectType.SOLOON, color: obj.color };
    default:
      return null;
    }
  }
  
  // Checks if a megaverse object can be created
  private canBeCreated(obj: MegaverseObject, megaverse: Megaverse, row: number, column: number): boolean {
    if (obj.type !== MegaverseObjectType.SOLOON) {
      return true;
    }
  
    // Left, right, up, down
    const coordinates = [[0,-1], [0,1], [-1,0], [1,0]];
  
    // If the object is a soloon, then we need to check if one of the adjacent objects is a polyanet.
    // If none of the adjacent objects are a polyanet, then the soloon cannot be created.
    return coordinates.some(([i, j]) => {
      const adjacentObject = megaverse[row + i]?.[column + j];
  
      return adjacentObject?.type === MegaverseObjectType.POLYANET;
    });
  }
}