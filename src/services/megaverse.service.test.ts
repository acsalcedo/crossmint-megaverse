import { MegaverseService } from './megaverse.service';
import { MegaverseObjectType, Polyanet, Cometh, Soloon, Space } from '../megaverse.entity';
import { MegaverseAPIService } from './crossmint-api.types';

export const mockMegaverseAPIService: jest.Mocked<MegaverseAPIService> = {
  getGoalMap: jest.fn(),
  createMegaverseObject: jest.fn(),
  deleteMegaverseObject: jest.fn(),
};

describe('MegaverseService', () => {
  let megaverseService: MegaverseService;

  beforeEach(() => {
    jest.clearAllMocks();
    megaverseService = new MegaverseService(mockMegaverseAPIService);
  });

  describe('createMegaverse', () => {
    it('should call API to create objects if they can be created', async () => {
      const megaverse = [
        [new Polyanet(), new Space(), new Soloon('blue')],
        [new Soloon('red'), new Cometh('down'), new Space()]
      ];
      
      mockMegaverseAPIService.getGoalMap.mockResolvedValue(megaverse);
      
      await megaverseService.createMegaverse();
      
      expect(mockMegaverseAPIService.createMegaverseObject).toHaveBeenCalledTimes(3);

      expect(mockMegaverseAPIService.createMegaverseObject).toHaveBeenCalledWith({ 
        row: 0, column: 0, type: MegaverseObjectType.POLYANET 
      });
      expect(mockMegaverseAPIService.createMegaverseObject).toHaveBeenCalledWith({ 
        row: 1, column: 0, type: MegaverseObjectType.SOLOON, color: 'red' 
      });
      expect(mockMegaverseAPIService.createMegaverseObject).toHaveBeenCalledWith({ 
        row: 1, column: 1, type: MegaverseObjectType.COMETH, direction: 'down' 
      });
    });

    it('should not call API when there are only space objects', async () => {
      const megaverse = [
        [new Space(), new Space()],
        [new Space(), new Space()]
      ];
      
      mockMegaverseAPIService.getGoalMap.mockResolvedValue(megaverse);
      
      await megaverseService.createMegaverse();
      
      expect(mockMegaverseAPIService.createMegaverseObject).not.toHaveBeenCalled();
    });

    it('should not call API if goal map is empty', async () => {
      const megaverse = [];
      
      mockMegaverseAPIService.getGoalMap.mockResolvedValue(megaverse);
      
      await megaverseService.createMegaverse();
      
      expect(mockMegaverseAPIService.createMegaverseObject).not.toHaveBeenCalled();
    });
  });
});
