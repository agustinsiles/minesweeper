interface GameConfig {
    id: number,
    name: string,
    status: string,
    rows?: number,
    columns?: number,
    mines?: number,
    user: number
}

export default class Game {
    private _id: number;
    name: string;
    status: string;
    rows: number;
    columns: number;
    mines: number;
    user: number;

    constructor(game: GameConfig) {
        this._id = game.id;
        this.name = game.name;
        this.status = game.status;
        this.rows = game.rows;
        this.columns = game.columns;
        this.mines = game.mines;
        this.user = game.user;
    }

    set id(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}