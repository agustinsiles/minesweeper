import * as _ from 'lodash';
import { DataStore } from '@stores/data.store';
import Game from "@classes/game";
import constants from "@app/constants";

const _dataStore = DataStore.getInstance;

interface CellConfig {
    game: Game,
    xPosition: number,
    yPosition: number,
    revealed: boolean,
    hasMine: boolean,
    flagged: boolean
}

export default class Cell {
    game: Game;
    xPosition: number;
    yPosition: number;
    revealed: boolean;
    flagged: boolean;
    hasMine: boolean;

    constructor(cell: CellConfig) {
        this.game = cell.game;
        this.xPosition = cell.xPosition;
        this.yPosition = cell.yPosition;
        this.revealed = cell.revealed || false;
        this.flagged = cell.flagged;
        this.hasMine = cell.hasMine;
    }

    private _getAdjacentCells(): Array<Cell> {
        const x = this.xPosition;
        const y = this.yPosition;
        const adjacentCells: Array<Cell> = [];
        const adjacentCoordenates = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1]
        ];

        adjacentCoordenates.forEach(coordenate => {
            if (coordenate[0] > 0 && coordenate[1] > 0) {
                const cellInCoordenate = _.find(_dataStore.cells, cell => 
                    cell.game.id === this.game.id && cell.xPosition === coordenate[0] && cell.yPosition === coordenate[1]);
                adjacentCells.push(cellInCoordenate);
            }
        });

        return adjacentCells;
    }

    get adjacentMines(): Array<Cell> {
        return _.filter(this._getAdjacentCells(), { hasMine: true });
    }

    revealStatus(): number {
        if (this.hasMine) {
            this.game.status = constants.STATUSES.LOST;
            return -1;
        }

        const adjacentMines = this.adjacentMines.length;

        if (adjacentMines) {
            return adjacentMines;
        }
        
        return 0;
    }

    revealAdjacentEmptyCells = (): Array<Cell> => _.filter(this._getAdjacentCells(), { hasMine: false, revealed: false });
}
