import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import Game from './classes/game';
import constants from './constants';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    activeGame: Game;
    gameStarted: boolean = false;
    gameOptions: any = {
        columns: 0,
        rows: 0,
        mines: 0
    };

    constructor(private _dataService: DataService) {}

    startGame(): void {
        const newGame: Game = new Game({
            id: 1,
            status: constants.STATUSES.IN_PROGRESS,
            rows: this.gameOptions.rows || 30,
            columns: this.gameOptions.rows || 30,
            mines: this.gameOptions.mines || 10,
            user: 1
        });

        this._dataService.createGame(newGame);

        this.activeGame = newGame;
        this.gameStarted = true;
    }

    endGame(): void {
        this.gameStarted = false;
        this.activeGame = null;
    }
}
