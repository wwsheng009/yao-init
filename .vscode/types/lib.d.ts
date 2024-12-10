// 不要直接使用export * from 的语法。
import {
  Process,
  Exception,
  $L,
  FS,
  http,
  log,
  Query,
  Store,
  Studio,
  WebSocket
} from '@yaoapps/client';

export {
  Process,
  Exception,
  $L,
  FS,
  http,
  log,
  Query,
  Store,
  Studio,
  WebSocket
};

export * from './sui';
export * from './neo';
export * from './io';

export type LoadOption = {
  /**
   * The action to perform.
   */
  action: 'start' | 'run' | 'migrate';

  /**
   * The mode to run the action in.
   */
  ignoredAfterLoad: boolean;

  /**
   * Is reloading the environment required?
   */
  reload: boolean;
};

/**
 * The migration options.
 */
export type MigrateOption = {
  /**
   * YAO_ENV environment variable.
   */
  mode: 'production' | 'development';

  /**
   * Is the force flag set?
   */
  force: boolean;

  /**
   * Is the reset flag set?
   */
  reset: boolean;
};
