import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '@services/data.service';
import Game from '@classes/game';
import constants from '@app/constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    activeGame: Game;    
    archivedGames: Array<Game>;
    timer: number;
    interval;
    gamesObserver;
    gameStatusObserver;
    gameStatusNotification: string;
    gameStarted: boolean = false;
    gameSetupForm: FormGroup;
    gameOptions: any = {
        columns: 0,
        rows: 0,
        mines: 0
    };
    submitted: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private _dataService: DataService
    ) {}

    get f() { return this.gameSetupForm.controls; }

    ngOnInit(): void {
        this.archivedGames = this._dataService.getAllGames();
        this.gamesObserver = this._dataService.gamesSubject.subscribe(games => {
			this.archivedGames = games;
        });
        
        this.gameStatusObserver = this._dataService.gameStatusSubject.subscribe(wonGame => {
            if (wonGame) {
                this.endGame(true);
            }
        });

        this.gameSetupForm = this.formBuilder.group({
            useDefaultValues: [''],
            columns: ['', Validators.required],
            rows: ['', Validators.required],
            mines: ['', Validators.required]
        });

        this.setGameConfig();
    }

    ngOnDestroy(): void {
        this.gamesObserver.unsubscribe();
        this.gameStatusObserver.unsubscribe();
    }

    onSetupSubmit(): void {
        this.submitted = true;

        const useDefaultValues = this.f.useDefaultValues.value;

        if (!useDefaultValues && this.gameSetupForm.invalid) {
            return;
        }

        const rows = useDefaultValues ? 10 : this.f.rows.value;
        const columns = useDefaultValues ? 10 : this.f.columns.value;
        const mines = useDefaultValues ? 25 : this.f.mines.value;

        const maxMines = (rows * columns) / 2;
        if (!useDefaultValues && maxMines < mines) {
            alert(`You have ${rows * columns} cells. You can't add more than ${maxMines}`);
            return;
        }

        if (this.timer) this._pauseTimer();

        this._createNewGame(columns, rows, mines);
    }

    private _createNewGame(columns, rows, mines): void {
        this.activeGame = null;
        this.gameStatusNotification = '';
        
        const newGame: Game = new Game({
            id: this._dataService.getNextId(),
            status: constants.STATUSES.IN_PROGRESS,
            rows,
            columns,
            mines,
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

        this._pauseTimer();
        this._dataService.updateGame(this.activeGame);

        this.gameStatusNotification = constants.MESSAGES[this.activeGame.status];
    }

    private _startTimer(): void {
        this.timer = this.activeGame && this.activeGame.timeSpent || 1;
        this.interval = setInterval(() => {
            this.timer++;
        },1000);
    }

    setGameConfig(): void {
        const gridValidators: Array<any> = [];
        const minesValidators: Array<any> = [];

        if (!this.f.useDefaultValues.value) {
            gridValidators.push(...[Validators.required, Validators.min(5), Validators.max(20)]);
            minesValidators.push(...[Validators.required, Validators.min(1)]);
        }
        
        this.f.columns.setValidators(gridValidators);
        this.f.rows.setValidators(gridValidators);
        this.f.mines.setValidators(minesValidators);

        this.f.columns.updateValueAndValidity();
        this.f.rows.updateValueAndValidity();
        this.f.mines.updateValueAndValidity();
    }

    startNewGame(): void {
        this.activeGame.timeSpent = this.timer;
        this._dataService.updateGame(this.activeGame);
        this._pauseTimer();
        this.gameStatusNotification = '';
        this.activeGame = null;
    }

    resumeGame(game: Game): void {
        this.activeGame = game;
        this._startTimer();
    }

    private _pauseTimer(): void {
        clearInterval(this.interval);
    }
}
