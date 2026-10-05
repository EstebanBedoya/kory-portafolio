import * as migration_20260907_073312_initial from './20260907_073312_initial';
import * as migration_20260907_225339_textos from './20260907_225339_textos';
import * as migration_20261005_023735_galerias from './20261005_023735_galerias';
import * as migration_20261005_025227_fotos_por_obra from './20261005_025227_fotos_por_obra';
import * as migration_20261005_030318_proyectos_a_obras from './20261005_030318_proyectos_a_obras';

export const migrations = [
  {
    up: migration_20260907_073312_initial.up,
    down: migration_20260907_073312_initial.down,
    name: '20260907_073312_initial',
  },
  {
    up: migration_20260907_225339_textos.up,
    down: migration_20260907_225339_textos.down,
    name: '20260907_225339_textos',
  },
  {
    up: migration_20261005_023735_galerias.up,
    down: migration_20261005_023735_galerias.down,
    name: '20261005_023735_galerias',
  },
  {
    up: migration_20261005_025227_fotos_por_obra.up,
    down: migration_20261005_025227_fotos_por_obra.down,
    name: '20261005_025227_fotos_por_obra',
  },
  {
    up: migration_20261005_030318_proyectos_a_obras.up,
    down: migration_20261005_030318_proyectos_a_obras.down,
    name: '20261005_030318_proyectos_a_obras'
  },
];
