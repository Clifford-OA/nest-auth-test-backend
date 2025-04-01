import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import secondConfig from 'src/db/second.config';

@Injectable()
export class SecondDatabaseService {
  private readonly logger = new Logger(SecondDatabaseService.name);
  private orm: MikroORM;
  private _em: EntityManager;

  // private initializationPromise: Promise<void>;

  // async onModuleInit() {
  //   this.initializationPromise = (async () => {
  //     try {
  //       this.orm = await MikroORM.init(secondConfig);
  //       await this.orm.migrator.up();
  //       this._em = this.orm.em.fork();
  //       this.logger.log('Second database initialized');
  //     } catch (error) {
  //       this.logger.error('Second database initialization failed:', error);
  //       throw error;
  //     }
  //   })();
  // }

  async waitForInitialization() {
    if (this._em) return this._em;
    else
      try {
        this.orm = await MikroORM.init(secondConfig);
        await this.orm.migrator.up();
        this._em = this.orm.em.fork();
        this.logger.log('Second database initialized');
        return this._em;
      } catch (error) {
        this.logger.error('Second database initialization failed:', error);
        throw error;
      }
  }

  async close(): Promise<void> {
    if (this.orm && (await this.orm.isConnected())) {
      await this.orm.close();
      this.logger.log('Second database connection closed');
    }
  }

  get em() {
    if (!this._em) {
      throw new Error('Second database not initialized');
    }

    return this._em;
  }
}
