import * as migration_20260907_073312_initial from './20260907_073312_initial';
import * as migration_20260907_225339_textos from './20260907_225339_textos';

export const migrations = [
  {
    up: migration_20260907_073312_initial.up,
    down: migration_20260907_073312_initial.down,
    name: '20260907_073312_initial',
  },
  {
    up: migration_20260907_225339_textos.up,
    down: migration_20260907_225339_textos.down,
    name: '20260907_225339_textos'
  },
];
