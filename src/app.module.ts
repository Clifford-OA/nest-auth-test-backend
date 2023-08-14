import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@app/common';
// import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import entities from './db/entities';

@Module({
  imports: [
    // ConfigModule.forRoot({isGlobal: true}),
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature(entities),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
