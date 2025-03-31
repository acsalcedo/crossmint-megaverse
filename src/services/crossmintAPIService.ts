import axios from 'axios';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Color = 'blue' | 'red' | 'purple' | 'white';

export type Polyanet = 'POLYANET';
export type Cometh = 'UP_COMETH' | 'DOWN_COMETH' | 'LEFT_COMETH' | 'RIGHT_COMETH';
export type Soloon = 'WHITE_SOLOON' | 'BLUE_SOLOON' | 'RED_SOLOON' | 'PURPLE_SOLOON';
export type Tile = 'SPACE' | Polyanet | Cometh | Soloon ;
export type Megaverse = Tile[][];

export class CrossmintAPIService {
  private candidateId = '44b615bd-8e1a-45e7-bbd2-5c57df3c2787';
  private baseURL = 'https://challenge.crossmint.io/api/';
  
  async getGoalMap(): Promise<Megaverse> {
    const endpoint = `${this.baseURL}/map/${this.candidateId}/goal`;
    const response = await this.retryWithExponentialBackoff(() => axios.get(endpoint));

    return response.data.goal as Megaverse;
  }

  async createPolyanet({ row, column }: { row: number, column: number}): Promise<void> {
    const endpoint = `${this.baseURL}/polyanets`;

    await this.retryWithExponentialBackoff(() =>
      axios.post(endpoint, { candidateId: this.candidateId, row, column })
    );
  }

  async createCometh({ row, column, direction }: { row: number, column: number, direction: Direction }): Promise<void> {
    const endpoint = `${this.baseURL}/comeths`;

    await this.retryWithExponentialBackoff(() =>
      axios.post(endpoint, { candidateId: this.candidateId, row, column, direction })
    );
  }

  async createSoloon({ row, column, color }: { row: number, column: number, color: Color }): Promise<void> {
    const endpoint = `${this.baseURL}/soloons`;

    await this.retryWithExponentialBackoff(() =>
      axios.post(endpoint, { candidateId: this.candidateId, row, column, color })
    );
  }

  async deletePolyanet({ row, column }: { row: number, column: number}): Promise<void> {
    const endpoint = `${this.baseURL}/polyanets`;

    await this.retryWithExponentialBackoff(() =>
      axios.delete(endpoint, { data: { candidateId: this.candidateId, row, column }})
    );
  }

  async deleteCometh({ row, column }: { row: number, column: number}): Promise<void> {
    const endpoint = `${this.baseURL}/comeths`;

    await this.retryWithExponentialBackoff(() =>
      axios.delete(endpoint, { data: { candidateId: this.candidateId, row, column }})
    );
  }

  async deleteSoloon({ row, column }: { row: number, column: number}): Promise<void> {
    const endpoint = `${this.baseURL}/soloons`;

    await this.retryWithExponentialBackoff(() =>
      axios.delete(endpoint, { data: { candidateId: this.candidateId, row, column }})
    );
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
          throw error;
        }
      }
      attempt++;
    }
  
    throw new Error(`Request failed after ${maxRetries} retries.`);
  }
}
