import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import Game from './classes/game';
import constants from './constants';
import { timer } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    activeGame: Game;
    archivedGames: Array<Game> = JSON.parse(localStorage.getItem('games')) || [];
    timer: number;
    timerObservable;
    gameStarted: boolean = false;
    gameOptions: any = {
        columns: 0,
        rows: 0,
        mines: 0
    };

    constructor(private _dataService: DataService) {}

    startGame(): void {
        this.activeGame = null;

        const newGame: Game = new Game({
            id: 1,
            status: constants.STATUSES.IN_PROGRESS,
            rows: this.gameOptions.rows || 10,
            columns: this.gameOptions.rows || 10,
            mines: this.gameOptions.mines || 50,
            user: this._dataService.getNextId(),
            date: new Date()
        });

        this._dataService.createGame(newGame);
        this.startTimer();
        this.activeGame = newGame;
    }

    endGame(): void {
        const activeGame: Game = this.activeGame;

        if (!activeGame) {
            return;
        }

        this.timerObservable.unsubscribe();

        activeGame.status = constants.STATUSES.LOST;
        activeGame.timeSpent = this.timer;

        this._dataService.updateGame(activeGame);
        alert('Oops, you hit a mine! You lost this battle.');
    }

    startTimer(): void {
        this.timer = 0;
        const source = timer(1000, 1000);
        this.timerObservable = source.subscribe(val => this.timer = val);
    }
}
