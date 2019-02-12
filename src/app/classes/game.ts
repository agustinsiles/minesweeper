interface GameConfig {
    id: number,
    status: string,
    rows?: number,
    columns?: number,
    mines?: number,
    user: number,
    timeSpent?: number,
    date: Date
}

export default class Game {
    private _id: number;
    status: string;
    rows: number;
    columns: number;
    mines: number;
    user: number;
    timeSpent: number;
    date: Date;

    constructor(game: GameConfig) {
        this._id = game.id;
        this.status = game.status;
        this.rows = game.rows;
        this.columns = game.columns;
        this.mines = game.mines;
        this.user = game.user;
        this.timeSpent = game.timeSpent;
        this.date = game.date;
    }

    set id(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}