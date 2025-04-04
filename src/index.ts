import { MegaverseService } from './services/megaverse.service';
import { CrossmintAPIService } from './services/crossmint-api.service';

if (process.env.NODE_ENV !== 'test') {
  console.log('Creating megaverse');
  const megaverse = new MegaverseService(new CrossmintAPIService());

  megaverse.createMegaverse()
    .then(()=> console.log('Finished creating megaverse'))
    .catch((error) => console.error(error));
  

}
