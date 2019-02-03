import * as _ from "lodash";
import Game from "../classes/game";
import Cell from "../classes/cell";

export class DataStore {
    static getInstance: DataStore = new DataStore();
    private _games: Array<Game> = JSON.parse(localStorage.getItem('games')) || [];
    private _cells: Array<Cell> = JSON.parse(localStorage.getItem('cells')) || [];

    private _saveGameOnStorage(): void {
        localStorage.setItem('games', JSON.stringify(this._games));
    }
    
    get games(): Array<Game> {
        return _.cloneDeep(this._games);
    }

    set games(games: Array<Game>) {
        this._games = games;        
    }

    createNewGame(game: Game): void {
        this._games.push(game);
        this._saveGameOnStorage();
    }

    updateGameStatus(game: Game): void {
        const g = _.find(this._games, { id: game.id });
        _.assign(g, game);

        this._saveGameOnStorage();
    }

    get cells(): Array<Cell> {
        return _.cloneDeep(this._cells);
    }

    set cells(cells: Array<Cell>) {
        this._cells = cells;
    }

    createCell(cell: Cell): void {
        this._cells.push(cell);
    }

    getCellsByGame = (game: number): Array<Cell> => _.filter(this._cells, { game });
}