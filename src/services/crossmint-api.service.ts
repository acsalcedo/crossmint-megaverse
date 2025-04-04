import axios from 'axios';
import { Color, Cometh, Direction, Megaverse, MegaverseObjectType, Polyanet, Soloon, Space } from '../megaverse.entity';
import { SoloonColorMap, ComethDirectionMap, MegaverseApi, MegaverseApiObject, MegaverseObjectTypeToEndpointResourceName, CreateMegaverseObjectInput, MegaverseAPIService } from './crossmint-api.types';

export class CrossmintAPIService implements MegaverseAPIService {
  private candidateId = '44b615bd-8e1a-45e7-bbd2-5c57df3c2787';
  private baseURL = 'https://challenge.crossmint.io/api/';
  
  async getGoalMap(): Promise<Megaverse> {
    const endpoint = `${this.baseURL}/map/${this.candidateId}/goal`;
    const response = await this.retryWithExponentialBackoff(() => axios.get(endpoint));

    return this.parseGoalMap(response.data.goal);
  }

  async createMegaverseObject(input: CreateMegaverseObjectInput): Promise<void> {
    const resource = MegaverseObjectTypeToEndpointResourceName[input.type];

    if (!resource) {
      console.error(`Invalid megaverse object: ${input.type}`);
      return;
    }

    const endpoint = `${this.baseURL}/${resource}`;

    const body: { 
      candidateId: string,
      row: number, 
      column: number,
      direction?: Direction, 
      color?: Color } = { candidateId: this.candidateId, row: input.row, column: input.column };

    if (input.type === MegaverseObjectType.COMETH) {
      body.direction = input.direction;
    } else if (input.type === MegaverseObjectType.SOLOON) {
      body.color = input.color;
    }

    await this.retryWithExponentialBackoff(() => axios.post(endpoint, body));
  }

  async deleteMegaverseObject({ type, row, column }: { 
    type: MegaverseObjectType, row: number, column: number
  }): Promise<void> {
    const resource = MegaverseObjectTypeToEndpointResourceName[type];

    if (!resource) {
      console.error(`Invalid megaverse object: ${type}`);
      return;
    }

    const endpoint = `${this.baseURL}/${resource}`;

    await this.retryWithExponentialBackoff(() =>
      axios.delete(endpoint, { data: { candidateId: this.candidateId, row, column }})
    );
  }

  private parseGoalMap(goal: MegaverseApi): Megaverse {
    return goal.map(row => row.map(tile => this.getMegaverseObject(tile)));
  }

  private getMegaverseObject(obj: MegaverseApiObject) {
    if (obj === 'POLYANET') {
      return new Polyanet();

    } else if (obj.includes('COMETH')) {
      const direction = ComethDirectionMap[obj];

      if (!direction) {
        console.error(`Skipping unknown cometh direction ${direction}`);
        return new Space();
      } 

      return new Cometh(direction);

    } else if (obj.includes('SOLOON')) {
      const color = SoloonColorMap[obj];

      if (!color) {
        console.error(`Skipping unknown soloon color ${color}`);
        return new Space();
      }
    
      return new Soloon(color);  
    }
      
    return new Space();
  }

  private async retryWithExponentialBackoff<T>(
    request: () => Promise<T>, 
    maxRetries = 5
  ): Promise<T> {
    let attempt = 0;
  
    while (attempt < maxRetries) {
      try {
        return await request();
      } catch (error: any) {
        // Retry with exponential backoff if the API is rate limited
        if (error.response?.status === 429) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`Rate limit error, attempt ${attempt + 1}. Retry in ${delay / 1000} seconds.`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          const errorMessage = `Error with request: ${error.message}, , attempt: ${attempt + 1}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      attempt++;
    }
  
    throw new Error(`Request failed after ${maxRetries} retries.`);
  }
}
