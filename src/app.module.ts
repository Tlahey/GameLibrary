import { ArgusService } from './services/argus.service';
import { GameService } from './services/game.service';
import { GamesController } from './controllers/games/games.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { databaseProviders } from './database.provider';
import { GameEntity } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ...databaseProviders,
    TypeOrmModule.forFeature([GameEntity]),
  ],
  controllers: [
    GamesController, 
    AppController
  ],
  providers: [
    ArgusService, 
    GameService, 
    AppService
  ],
})
export class AppModule {}
