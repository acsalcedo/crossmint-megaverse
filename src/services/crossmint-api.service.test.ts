import axios from 'axios';
import { CrossmintAPIService } from './crossmint-api.service';
import { MegaverseObjectType, Polyanet, Cometh, Soloon, Space } from '../megaverse.entity';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CrossmintAPIService', () => {
  let service: CrossmintAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CrossmintAPIService();
  });

  describe('getGoalMap', () => {
    it('should call API and parse the goal map', async () => {
      const mockApiResponse = { 
        data: { 
          goal: [
            ['POLYANET', 'SPACE', 'POLYANET', 'SPACE'], 
            ['BLUE_SOLOON', 'RED_SOLOON', 'WHITE_SOLOON', 'PURPLE_SOLOON'],
            ['UP_COMETH', 'DOWN_COMETH', 'LEFT_COMETH', 'RIGHT_COMETH']] 
        } 
      };
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await service.getGoalMap();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://challenge.crossmint.io/api//map/44b615bd-8e1a-45e7-bbd2-5c57df3c2787/goal');
      
      expect(result).toEqual([
        [new Polyanet(), new Space(), new Polyanet(), new Space()],
        [new Soloon('blue'), new Soloon('red'), new Soloon('white'), new Soloon('purple')],
        [new Cometh('up'), new Cometh('down'), new Cometh('left'), new Cometh('right')]
      ]);
    });

    it('should return unknown object as space', async () => {
      const mockApiResponse = { 
        data: { 
          goal: [
            ['UNKNOWN', 'GREEN_SOLOON'], 
          ]
        } 
      };
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await service.getGoalMap();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://challenge.crossmint.io/api//map/44b615bd-8e1a-45e7-bbd2-5c57df3c2787/goal');
      
      expect(result).toEqual([
        [new Space(), new Space()],
      ]);
    });
  });

  describe('createMegaverseObject', () => {
    it('should send a POST request with correct payload for a Polyanet', async () => {
      mockedAxios.post.mockResolvedValue({});

      await service.createMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.POLYANET });

      expect(mockedAxios.post).toHaveBeenCalledWith('https://challenge.crossmint.io/api//polyanets', {
        candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
        row: 1,
        column: 2
      });
    });

    it('should send a POST request with correct payload for a Cometh', async () => {
      mockedAxios.post.mockResolvedValue({});

      await service.createMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.COMETH, direction: 'down' });

      expect(mockedAxios.post).toHaveBeenCalledWith('https://challenge.crossmint.io/api//comeths', {
        candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
        row: 1,
        column: 2,
        direction: 'down'
      });
    });

    it('should send a POST request with correct payload for a Soloon', async () => {
      mockedAxios.post.mockResolvedValue({});

      await service.createMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.SOLOON, color: 'blue' });

      expect(mockedAxios.post).toHaveBeenCalledWith('https://challenge.crossmint.io/api//soloons', {
        candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
        row: 1,
        column: 2,
        color: 'blue'
      });
    });

    it('should log an error for an invalid type', async () => {
      console.error = jest.fn();

      await service.createMegaverseObject({ row: 1, column: 2, type: 'INVALID_TYPE' as MegaverseObjectType } as any);

      expect(console.error).toHaveBeenCalledWith('Invalid megaverse object: INVALID_TYPE');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  describe('deleteMegaverseObject', () => {
    it('should send a DELETE request with correct payload for a Polyanet', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await service.deleteMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.POLYANET });

      expect(mockedAxios.delete).toHaveBeenCalledWith('https://challenge.crossmint.io/api//polyanets', {
        data: {
          candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
          row: 1,
          column: 2
        }
      });
    });

    it('should send a DELETE request with correct payload for a Cometh', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await service.deleteMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.COMETH });

      expect(mockedAxios.delete).toHaveBeenCalledWith('https://challenge.crossmint.io/api//comeths', {
        data: {
          candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
          row: 1,
          column: 2
        }
      });
    });

    it('should send a DELETE request with correct payload for a Soloon', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await service.deleteMegaverseObject({ row: 1, column: 2, type: MegaverseObjectType.SOLOON });

      expect(mockedAxios.delete).toHaveBeenCalledWith('https://challenge.crossmint.io/api//soloons', {
        data: {
          candidateId: '44b615bd-8e1a-45e7-bbd2-5c57df3c2787',
          row: 1,
          column: 2
        }
      });
    });

    it('should log an error for an invalid type', async () => {
      console.error = jest.fn();

      await service.deleteMegaverseObject({ row: 1, column: 2, type: 'INVALID_TYPE' as MegaverseObjectType });

      expect(console.error).toHaveBeenCalledWith('Invalid megaverse object: INVALID_TYPE');
      expect(mockedAxios.delete).not.toHaveBeenCalled();
    });
  });
});
