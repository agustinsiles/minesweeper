import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { DataService } from './services/data.service';
import Game from './classes/game';
import constants from './constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    activeGame: Game;    
    archivedGames: Array<Game>;
    timer: number;
    timerObservable;
    gamesObserver;
    gameStatusObserver;
    gameStarted: boolean = false;
    gameOptions: any = {
        columns: 0,
        rows: 0,
        mines: 0
    };

    constructor(private _dataService: DataService) {}

    ngOnInit(): void {
        this.archivedGames = this._dataService.getAllGames();
        this.gamesObserver = this._dataService.gamesSubject.subscribe(games => {
			this.archivedGames = games;
        });
        
        this.gameStatusObserver = this._dataService.gameStatusSubject.subscribe(wonGame => {
            if (wonGame) {
                this.endGame(true);
            }
        })
    }

    ngOnDestroy() {
        this.gamesObserver.unsubscribe();
        this.gameStatusObserver.unsubscribe();
    }

    startGame(): void {
        this.activeGame = null;

        const newGame: Game = new Game({
            id: this._dataService.getNextId(),
            status: constants.STATUSES.IN_PROGRESS,
            rows: this.gameOptions.rows || 10,
            columns: this.gameOptions.rows || 10,
            mines: this.gameOptions.mines || 50,
            user: 1,
            date: new Date()
        });

        this._dataService.createGame(newGame);
        this._startTimer();
        this.activeGame = newGame;
    }

    endGame(wonGame: boolean = false): void {
        if (!this.activeGame) {
            return;
        }

        this.activeGame.status = constants.STATUSES[wonGame ? 'WON' : 'LOST'];
        this.activeGame.timeSpent = this.timer;

        this.timerObservable.unsubscribe();
        this._dataService.updateGame(this.activeGame);

        const msg = wonGame ? 'Yay! You won!' : 'Oops, you hit a mine! You lost this battle.';
        alert(msg);
    }

    private _startTimer(): void {
        this.timer = 0;
        const source = timer(1000, 1000);
        this.timerObservable = source.subscribe(val => this.timer = val);
    }
}
