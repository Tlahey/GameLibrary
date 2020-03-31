import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ArgusService } from './argus.service';
import * as fs from 'fs';
import * as path from 'path';
import argusConfig from 'src/config/argus.config';

@Injectable()
export class GameService {

    private readonly logger = new Logger(GameService.name);

    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        private readonly argusService: ArgusService
    ) {
        
    }

    public getGames() {
        this.logger.debug("getGames", `Find games`);
        return this.gameRepository.find();
    }

    public async createGames(games: GameEntity[]) {
        this.gameRepository.insert(games);
        return true;
    }

    public injectDatabase() {
        const filePath = path.join(__dirname, "..", "..", "datas.json");
        const file = JSON.parse(fs.readFileSync(filePath).toString());
        return this.createGames(file);
    }
    
    public async updateGame(gameId: string, gameProperties: Partial<GameEntity>) {
        return await this.gameRepository.update(gameId, gameProperties);
    }

    @Cron(argusConfig().CRON_GET_INFORMATIONS)
    async updateGameInformations() {
        this.logger.debug('CRON update argus informations');
        const cookie = await this.argusService.getSessionID();

        const games = (await this.getGames());
        const gamesWithArgusUrl = games.filter(g => g.argusUrl);
        
        for (let i = 0, ii = gamesWithArgusUrl.length; i < ii; i++) {
            const game = gamesWithArgusUrl[i];
            const argusInformation = await this.argusService.getArgusInformations(game.argusUrl, cookie);
            
            this.logger.debug(`Load game informations [${game.name}]`, "updateGameInformations");
            if (argusInformation) {
                game.argus = game.argus || [];
                await this.updateGame(game.Id, {
                    argus: game.argus.concat(argusInformation)
                });
            }

            // Load thumbnail
            if (game.thumbnail == undefined) {
                const base64 = await this.argusService.getGameThumbnail(game.argusUrl, cookie);
                if (base64) {
                    await this.updateGame(game.Id, {
                        thumbnail: base64
                    });
                }
            }
        }
    }
  
}
