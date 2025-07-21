import { Module } from '../../../src/structures/Module';
import { Client } from '../../../src/client/Client';
import { jest } from '@jest/globals';

export class MockModule extends Module {
  constructor(client: Client) {
    super(client);
    this.slashCommands.push({
      name: 'testcommand',
      description: 'A test command',
      execute: jest.fn() as any,
    });
  }
  onLoad = jest.fn() as any;
  onUnload = jest.fn() as any;
}

export class AlreadyLoadedModule extends Module {
  constructor(client: Client) {
    super(client);
  }
}

export default MockModule; // Default export for MockModule
export const otherExports = { AlreadyLoadedModule };