import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { DataStore } from '../stores/data.store';

import Game from '../classes/game';
import Cell from '../classes/cell';

@Injectable({
	providedIn: 'root'
})
export class ArticuloService {
	private _dataStore = DataStore.getInstance;

	constructor() {}

	createGame(game: Game) {
		this._dataStore.createNewGame(game);
		this._setCells(game);
	}

	private _setCells(game: Game) {
		const mines = [];

		for (let i = 1; i <= game.mines; i++) {
			let isMineAdded = false;
			let xPosition, yPosition;

			do {
				xPosition = this._getRandomCoordenate(1, game.columns);
				yPosition = this._getRandomCoordenate(1, game.rows);
		
				isMineAdded = _.some(mines, { xPosition, yPosition });
			} while (isMineAdded);

			mines.push({ xPosition, yPosition });
		}

		for (let y = 1; y <= game.rows; y++) {
			for (let x = 1; y <= game.columns; y++) {
				const hasMine = _.some(mines, { xPosition: x, yPosition: y });
				this._dataStore.createCell(new Cell({
					game,
					xPosition: x,
					yPosition: y,
					revealed: false,
					flagged: false,
					hasMine
				}));
			}
		}
	}

	private _getRandomCoordenate(a, b) {
		return Math.floor((Math.random() * (b - a) + 1));
	}
}
