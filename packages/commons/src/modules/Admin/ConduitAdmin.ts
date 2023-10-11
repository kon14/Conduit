import { ConduitRoute } from '@conduitplatform/hermes';
import { GrpcServer } from '@conduitplatform/module-tools';
import type convict from 'convict';
import { ConduitCommons } from '../../index';

export abstract class IConduitAdmin {
  protected constructor(protected readonly commons: ConduitCommons) {}

  abstract initialize(server: GrpcServer): Promise<void>;

  abstract subscribeToBusEvents(): Promise<void>;

  abstract registerRoute(route: ConduitRoute): void;

  abstract setConfig(moduleConfig: any): Promise<any>;

  abstract handleConfigUpdate(config: convict.Config<any>): void;

  protected abstract onConfig(): void;
}
