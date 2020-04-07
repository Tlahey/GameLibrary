import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { GameService } from 'src/services/game.service';
import { GameEntity } from 'src/entities/game.entity';

@Controller("/games")
export class GamesController {

    constructor(private readonly gameService: GameService) {

    }

    @Get()
    public getGames() {
        return this.gameService.getGames();
    }

    @Post() 
    public createGames(@Body() games: GameEntity[]) {
        return this.gameService.createGames(games);
    }

    @Post("/inject")
    public injectFile() {
        return this.gameService.injectDatabase();
    }

    @Patch() 
    public updateGame() {
        return "UPDATE";
    }

    @Delete()
    public deleteGame() {
        return "DELETE";
    }

    @Post("/update-datas")
    public updateDatas() {
        return this.gameService.updateGamesInformations();
    }

    @Get("/consoles")
    public async getConsoles() {
        const console = (await this.gameService.getGames()).reduce((arr, current) => {
            if (!arr.includes(current.console)) {
                arr.push(current.console);
            }
            return arr;
        }, []);
        return console;
    }

}
