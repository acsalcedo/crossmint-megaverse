import { CrossmintAPIService } from './services/crossmintAPIService';

export const main = async () => { 
  const crossmintAPI = new CrossmintAPIService();

  const megaverse = await crossmintAPI.getGoalMap();

  for (let i = 0; i < megaverse.length;  i++) {
    const row =  megaverse[i];
    for (let j = 0; j < row.length; j++) {
      const tile = row[j];

      if (tile === 'POLYANET') {
        await crossmintAPI.createPolyanet({ row: i, column: j});
      }
    }
  }
};

main();

