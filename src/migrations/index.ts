import * as migration_20260907_073312_initial from './20260907_073312_initial';

export const migrations = [
  {
    up: migration_20260907_073312_initial.up,
    down: migration_20260907_073312_initial.down,
    name: '20260907_073312_initial'
  },
];
