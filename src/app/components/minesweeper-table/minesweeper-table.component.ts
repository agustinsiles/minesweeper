import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '@services/data.service';
import Game from '@classes/game';
import Cell from '@classes/cell';
import constants from '@app/constants';

@Component({
    selector: 'minesweeper-table',
    templateUrl: './minesweeper-table.component.html',
    styleUrls: ['./minesweeper-table.component.scss']
})
export class MinesweeperTableComponent {
    @Input() game: Game;
    @Output() onGameEnd: EventEmitter<any> = new EventEmitter();
    
    columnList: Array<number>;
    rowList: Array<number>;

    constructor(private _dataService: DataService) {}
    
    ngOnInit(): void {
        this.columnList = Array(this.game.columns).fill(1).map((x,i) => i + 1);
        this.rowList = Array(this.game.rows).fill(1).map((x,i) => i + 1);
    }

    ngAfterViewInit(): void {
        const cellsOfExistingGame: Array<Cell> = this._dataService.getCellsByGame(this.game.id);

        if (!cellsOfExistingGame.length) {
            return;
        }
        
        const revealedCells: Array<Cell> = _.filter(cellsOfExistingGame, { revealed: true });

        revealedCells.forEach((cell: Cell) => {
            const status = this._dataService.revealCellStatus(cell);
            const targetCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);

            if (status > 0) {
                targetCell.innerHTML = status.toString();
                targetCell.classList.add('numbered');
            } else if (status === 0) {
                targetCell.classList.add('empty');
            }
        });

        const flaggedCells = _.filter(cellsOfExistingGame, { flagged: true });
        flaggedCells.forEach((cell: Cell) => {
            const targetCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);
            targetCell.classList.add('flagged');
        });
    }

    private _gameInProgress = (): boolean => this.game.status === constants.STATUSES.IN_PROGRESS;

    private _getCellFromEvent(evt: any): Cell {
        const coordenates = (evt.target.attributes['coordenates'].value).split(',');
        const [ xPosition, yPosition ] = coordenates;
        return this._dataService.getCellByCoordenate([+xPosition, +yPosition]);
    }

    flagCell(evt: any): void {
        evt.preventDefault();

        if (!this._gameInProgress()) {
            alert(constants.MESSAGES.GAME_ENDED);
            return;
        }

        const cell: Cell = this._getCellFromEvent(evt);

        if (!cell || cell.revealed) {
            return;
        }

        const flaggedCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);
        flaggedCell.classList.toggle('flagged');

        cell.flagged = !cell.flagged;

        this._dataService.updateCell(cell);
    }

    revealCell(evt): void { 
        if (!this._gameInProgress()) {
            alert(constants.MESSAGES.GAME_ENDED);
            return;
        }

        const cell: Cell = this._getCellFromEvent(evt);
        
        if (!cell || cell.flagged || cell.revealed) {
            return;
        }

        const status = this._dataService.revealCellStatus(cell);
        const targetCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);

        if (status > 0) {
            evt.currentTarget.innerHTML = status;
            targetCell.classList.add('numbered');
        } else if (status === 0) {
            targetCell.classList.add('empty');
            this._getAllAdjacenEmptytMines(cell);
        } else if (status === -1) {
            targetCell.classList.add('mined');
            this._endGame();
            return;
        }

        this._dataService.checkGameStatus(this._dataService.getActiveGame());
    }

    private _getAllAdjacenEmptytMines(targetCell: Cell): void {
        const adjacentEmptyCells = targetCell.revealAdjacentEmptyCells();
        adjacentEmptyCells.forEach((cell: Cell) => {
            const { xPosition, yPosition } = cell;
            const emptyCell = document.getElementById(`${xPosition}-${yPosition}`);

            cell.revealed = true;

            this._dataService.updateCell(cell);

            const adjacentMinedCells = cell.adjacentMines;
            if (adjacentMinedCells.length) {
                emptyCell.innerHTML = cell.revealStatus().toString();
                emptyCell.classList.add('numbered');
            } else {
                emptyCell.classList.add('empty');
                // this._getAllAdjacenEmptytMines(c);
            }
        });
    }

    private _endGame(): void {
        const minedCells = this._dataService.getAllMinedCells();

        minedCells.forEach(cell => {
            const minedCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);
            minedCell.classList.add('mined');
        });

        this.onGameEnd.emit();
    }
}
