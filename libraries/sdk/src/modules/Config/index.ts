import { Config } from 'convict';

export abstract class IConfigManager {
  abstract getDatabaseConfigUtility(): IDatabaseConfigUtility;
  // abstract get appConfig(): IAppConfig;
  abstract initConfigAdminRoutes(): void;
  abstract registerAppConfig(): Promise<any>;
  abstract registerModulesConfig(name: string, newModulesConfigSchemaFields: any): Promise<any>;

}

export abstract class IDatabaseConfigUtility {
  abstract async registerConfigSchemas(newConfig: string): Promise<any>;
  abstract async updateDbConfig(newConfig: any): Promise<any>;
}

export abstract class IAppConfig {
  abstract get config(): Config<any>;

  abstract get configSchema(): any;
}
