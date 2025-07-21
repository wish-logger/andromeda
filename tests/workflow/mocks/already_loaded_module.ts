import { Module } from '../../../src/structures/Module';
import { Client } from '../../../src/client/Client';

export class AlreadyLoadedModule extends Module {
  constructor(client: Client) {
    super(client);
  }
}

export default AlreadyLoadedModule; 