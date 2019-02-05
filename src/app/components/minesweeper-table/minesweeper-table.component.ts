import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import Game from 'src/app/classes/game';
import Cell from 'src/app/classes/cell';
import constants from 'src/app/constants';

@Component({
    selector: 'minesweeper-table',
    templateUrl: './minesweeper-table.component.html',
    styleUrls: ['./minesweeper-table.component.scss']
})
export class MinesweeperTableComponent {
    @Input() game: Game;
    @Input() revealedCells: Array<Cell>;
    @Output() onGameEnd: EventEmitter<any> = new EventEmitter();
    
    columnList: Array<number>;
    rowList: Array<number>;

    constructor(private _dataService: DataService) {}
    
    ngOnInit(): void {
        this.columnList = Array(this.game.columns).fill(1).map((x,i) => i + 1);
        this.rowList = Array(this.game.rows).fill(1).map((x,i) => i + 1);
    }

    private _gameInProgress = (): boolean => this.game.status === constants.STATUSES.IN_PROGRESS;

    private _getCellFromEvent(evt): Cell {
        const coordenates = (evt.target.attributes['coordenates'].value).split(',');
        const [ xPosition, yPosition ] = coordenates;
        return this._dataService.getCellByCoordenate([+xPosition, +yPosition]);
    }

    flagCell(evt): void {
        evt.preventDefault();

        if (!this._gameInProgress()) {
            alert('Game already ended. Please start a new one');
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
            alert('Game already ended. Please start a new one');
            return;
        }

        const cell: Cell = this._getCellFromEvent(evt);
        
        if (!cell || cell.flagged) {
            return;
        }

        const status = this._dataService.revealCellStatus(cell);
        const targetCell = document.getElementById(`${cell.xPosition}-${cell.yPosition}`);

        if (status > 0) {
            evt.currentTarget.innerHTML = status;
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

    private _getAllAdjacenEmptytMines(cell: Cell) {
        const adjacentEmptyCells = cell.revealAdjacentEmptyCells();
        adjacentEmptyCells.forEach(c => {
            const emptyCell = document.getElementById(`${c.xPosition}-${c.yPosition}`);
            
            emptyCell.classList.add('empty');
            c.revealed = true;

            this._dataService.updateCell(c);

            // TODO: This works but performance must be improved.
            const adjacentMinedCells = c.adjacentMines;
            if (!adjacentMinedCells.length) {
                this._getAllAdjacenEmptytMines(c);
            } else {
                emptyCell.innerHTML = c.revealStatus().toString();
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
