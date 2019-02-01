import * as _ from "lodash";
import Game from "../classes/game";
import Cell from "../classes/cell";


export class DataStore {
    static getInstance: DataStore = new DataStore();
    private _games: Array<Game> = [];
    private _cells: Array<Cell> = [];
    private _activeGame: Game;
    
    get games(): Array<Game> {
        return _.cloneDeep(this._games);
    }

    set games(games: Array<Game>) {
        this._games = games;        
    }

    createNewGame(game: Game): void {
        this._games.push(game);
        this.activeGame = game;
    }

    updateGameStatus(game: Game): void {
        const g = _.find(this._games, { id: game.id });
        _.assign(g, game);
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

    get activeGame(): Game {
        return this._activeGame;
    }

    set activeGame(game: Game) {
        this._activeGame = game;
    }
}