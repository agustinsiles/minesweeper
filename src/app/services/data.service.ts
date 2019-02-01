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

	createGame() {
		
	}

	createCells() {
		
	}
}
