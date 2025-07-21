import { Client } from '../../src/client/Client';

describe('Client', () => {
  it('should initialize without errors', () => {
    const client = new Client();
    expect(client).toBeDefined();
  });
  
}); 