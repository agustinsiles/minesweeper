import * as _ from "lodash";
import Game from "@classes/game";
import Cell from "@classes/cell";

export class DataStore {
    static getInstance: DataStore = new DataStore();
    
    private _cells: Array<Cell> = [];
    private _games: Array<Game> = [];
    private _activeGame: Game;
    
    get games(): Array<Game> {
        return _.cloneDeep(this._games);
    }

    get activeGame(): Game {
        return this._activeGame;
    }

    get cells(): Array<Cell> {
        return _.cloneDeep(this._cells);
    }

    createNewGame(game: Game): void {
        this._games.push(game);
        this._activeGame = game;
    }

    updateGameStatus(game: Game): void {
        const g = _.find(this._games, { id: game.id });
        _.assign(g, game);
    }

    createCell(cell: Cell): void {
        this._cells.push(cell);
    }

    updateCell(cell: Cell): void {
        const c: Cell = _.find(this._cells, (c: Cell) => c.xPosition === cell.xPosition && c.yPosition === cell.yPosition && c.game.id === cell.game.id);
        _.assign(c, cell);
    }
}