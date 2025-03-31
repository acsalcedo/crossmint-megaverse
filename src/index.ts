import { Color, CrossmintAPIService, Direction } from './services/crossmintAPIService';

const directionMap: Record<string, Direction> = {
  'UP_COMETH': 'up',
  'DOWN_COMETH': 'down',
  'LEFT_COMETH': 'left',
  'RIGHT_COMETH': 'right'
};

const colorMap: Record<string, Color> = {
  'BLUE_SOLOON': 'blue',
  'RED_SOLOON': 'red',
  'PURPLE_SOLOON': 'purple',
  'WHITE_SOLOON': 'white',
};

export const main = async () => { 
  const crossmintAPI = new CrossmintAPIService();

  const megaverse = await crossmintAPI.getGoalMap();

  for (let i = 0; i < megaverse.length;  i++) {
    const row =  megaverse[i];
    for (let j = 0; j < row.length; j++) {
      const tile = row[j];

      if (tile === 'POLYANET') {
        await crossmintAPI.createPolyanet({ row: i, column: j });

      } else if (tile.includes('COMETH')) {
        const direction = directionMap[tile];

        if (!direction) {
          // handle error
        }

        await crossmintAPI.createCometh({ row: i, column: j, direction });

      } else if (tile.includes('SOLOON')) {
        const color = colorMap[tile];

        if (!color) {
          // handle error
        }

        await crossmintAPI.createSoloon({ row: i, column: j, color });
      }
    }
  }
};

// TODO
// convert strings into objects that can be easily processed
// separate typing into another file
// adding restriction to soloons in my code instead of just assuming that the given goal is good
main();

