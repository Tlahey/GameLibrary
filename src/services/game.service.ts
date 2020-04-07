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
        this.logger.debug(`Ajout d'un nouveau jeu ${JSON.stringify(games)}`, "createGames");
        const result = await this.gameRepository.insert(games);
        const ids = result.identifiers.map(i => i.id);
        console.log(result);
        // On récupère tous les games ajouté en bdd
        const gameList: Array<GameEntity> = await this.gameRepository.findByIds(ids);
        if (gameList.length > 0) {
            new Promise(async () => {
                const cookie = await this.argusService.getSessionID();
                for (let i = 0, ii = gameList.length; i < ii; i++) {
                    await this.processUpdateGameInformations(gameList[i], cookie);
                }
            })
        }
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
    async updateGamesInformations() {
        this.logger.debug('CRON update argus informations');
        const cookie = await this.argusService.getSessionID();

        const games = (await this.getGames());
        const gamesWithArgusUrl = games.filter(g => g.argusUrl);
        
        for (let i = 0, ii = gamesWithArgusUrl.length; i < ii; i++) {
            const game = gamesWithArgusUrl[i];
            await this.processUpdateGameInformations(game, cookie);
        }
    }

    async updateAGameInformation(game: GameEntity) {
        const cookie = await this.argusService.getSessionID();
        this.processUpdateGameInformations(game, cookie);
    }

    private async processUpdateGameInformations(game: GameEntity, cookie: string) {
        
        if (game.argusUrl) {
            const argusInformation = await this.argusService.getArgusInformations(game.argusUrl, cookie);
            this.logger.debug(`Load game informations [${game.name}]`, "updateGameInformations");
            if (argusInformation) {
                game.argus = game.argus || [];
                await this.updateGame(game.Id, {
                    argus: game.argus.concat(argusInformation)
                });
            }
        }

        const gameInformations = await this.argusService.getGameInformations(game.argusUrl, cookie);
        
        // Add thumbnail
        if (game.thumbnail == undefined && gameInformations.thumbnail) {
            await this.updateGame(game.Id, {
                thumbnail: gameInformations.thumbnail
            });
        }

        // Add release date
        if (game.releaseDate == undefined && gameInformations.releaseDate) {
            await this.updateGame(game.Id, {
                releaseDate: gameInformations.releaseDate
            });
        }

        // Add base price
        if (game.basePrice == undefined && gameInformations.basePrice) {
            await this.updateGame(game.Id, {
                basePrice: gameInformations.basePrice
            });
        }
    }
  
}
