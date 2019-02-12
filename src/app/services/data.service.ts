import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DataStore } from '@stores/data.store';
import Game from '@classes/game';
import Cell from '@classes/cell';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	private _dataStore = DataStore.getInstance;
	gamesSubject = new Subject<Array<Game>>();
	gameStatusSubject = new Subject<boolean>();
	
	getAllGames(): Array<Game> {
		return this._dataStore.games;
	}

	createGame(game: Game): void {
		this._dataStore.createNewGame(game);
		this._setCells(game);

		this.gamesSubject.next(this._dataStore.games);
	}

	private _getRandomMines(game: Game): Array<any> {
		const mines = [];

		for (let i = 1; i <= game.mines; i++) {
			let isMineAdded = false;
			let xPosition: number, yPosition: number;

			do {
				xPosition = this._getRandomCoordenate(1, game.columns);
				yPosition = this._getRandomCoordenate(1, game.rows);
		
				isMineAdded = _.some(mines, { xPosition, yPosition });
			} while (isMineAdded);

			mines.push({ xPosition, yPosition });
		}

		return mines;
	}

	private _getRandomCoordenate = (a: number, b: number): number => Math.round((Math.random() * (b - a) + 1));

	private _setCells(game: Game): void {
		const mines = this._getRandomMines(game);

		for (let yPosition = 1; yPosition <= game.rows; yPosition++) {
			for (let xPosition = 1; xPosition <= game.columns; xPosition++) {
				const hasMine = _.some(mines, { xPosition, yPosition });
				this._dataStore.createCell(new Cell({
					game,
					xPosition,
					yPosition,
					revealed: false,
					flagged: false,
					hasMine
				}));
			}
		}
	}

	getActiveGame(): Game {
		return this._dataStore.activeGame;
	}

	getCellByCoordenate(coordenate: Array<number>): Cell {
		const [ xPosition, yPosition ] = coordenate;
		return _.find(this._dataStore.cells, (c: Cell) => c.xPosition === xPosition && c.yPosition === yPosition && c.game.id === this._dataStore.activeGame.id);
	}

	getAllMinedCells(): Array<Cell> {
		return _.filter(this._dataStore.cells, (c: Cell) => c.hasMine && c.game.id === this._dataStore.activeGame.id);
	}

	updateGame(game: Game): void {
		this._dataStore.updateGameStatus(game);
		this.gamesSubject.next(this._dataStore.games);
	}

	getCellsByGame(gameId: number) {
		return _.filter(this._dataStore.cells, (c: Cell) => c.game.id === gameId);
	}

	checkGameStatus(game: Game) {
		const gameCells: Array<Cell> = this.getCellsByGame(game.id);
		const minedCells: Array<Cell> = _.filter(gameCells, { hasMine: true });
		const unrevealedCells: Array<Cell> = _.filter(gameCells, { revealed: false });

		if (minedCells.length === unrevealedCells.length) {
			this.gameStatusSubject.next(true);
		}
	}

	updateCell(cell: Cell): void {
		this._dataStore.updateCell(cell);
	}

	revealCellStatus(cell: Cell): number {
		cell.revealed = true;

		this.updateCell(cell);

		return cell.revealStatus();
	}

	getNextId(): number {
		const games: Array<Game> = this._dataStore.games;

        if (!games.length) {
            return 1;
        }

		const lastGame = games[games.length - 1];
		
        return lastGame.id + 1;
    }
}
