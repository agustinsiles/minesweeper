import * as _ from "lodash";
import Game from "../classes/game";
import Cell from "../classes/cell";


export class DataStore {
    static getInstance: DataStore = new DataStore();
    private _games: Array<Game> = [];
    private _cells: Array<Cell> = [];
    
    get games(): Array<Game> {
        return _.cloneDeep(this._games);
    }

    set games(games: Array<Game>) {
        this._games = games;        
    }

    get cells(): Array<Cell> {
        return _.cloneDeep(this._cells);
    }

    set cells(cells: Array<Cell>) {
        this._cells = cells;
    }

    createCell(cell: Cell) {
        this._cells.push(cell);
    }
}