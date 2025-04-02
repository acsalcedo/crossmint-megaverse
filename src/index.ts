import { Megaverse, MegaverseObject, MegaverseObjectType } from './megaverse.entity';
import { CrossmintAPIService } from './services/crossmint-api.service';
import { CreateMegaverseObjectInput } from './services/crossmint-api.types';


const mapToCreateInput = (obj: MegaverseObject, row: number, column: number): CreateMegaverseObjectInput => {
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
};

// Checks if a megaverse object can be created
const canBeCreated = (obj: MegaverseObject, megaverse: Megaverse, row: number, column: number): boolean => {
  if (obj.type !== MegaverseObjectType.SOLOON) {
    return true;
  }

  // Left, right, up, down
  const coordinates = [[0,-1], [0,1], [-1,0], [1,0]];

  // If the object is a soloon, then we need to check if one of the adjacent objects is a polyanet.
  return coordinates.some(([i, j]) => {
    const adjacentObject = megaverse[row + i][column + j];

    return adjacentObject.type === MegaverseObjectType.POLYANET;
  });
};

export const main = async () => { 
  const crossmintAPI = new CrossmintAPIService();
  const megaverse = await crossmintAPI.getGoalMap();

  for (const [i, row] of megaverse.entries()) {
    for (const [j, obj] of row.entries()) {
      const createInput = mapToCreateInput(obj, i, j);
      
      if (createInput && canBeCreated(obj, megaverse, i, j)) {
        await crossmintAPI.createMegaverseObject(createInput);
      }
    }
  }
};

main();
