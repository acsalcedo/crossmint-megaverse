import { MegaverseService } from './services/megaverse.service';
import { CrossmintAPIService } from './services/crossmint-api.service';

if (process.env.NODE_ENV !== 'test') {
  const megaverse = new MegaverseService(new CrossmintAPIService());

  megaverse.createMegaverse().catch((error) => console.error(error));
}
