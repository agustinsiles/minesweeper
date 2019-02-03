import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import Game from 'src/app/classes/game';
import Cell from 'src/app/classes/cell';
import { DataService } from 'src/app/services/data.service';

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

    revealCell(evt): void { 
        const coordenates = (evt.target.attributes['coordenates'].value).split(',');
        const [ xPosition, yPosition ] = coordenates;
        const cell: Cell = this._dataService.getCellByCoordenate([+xPosition, +yPosition]);

        if (!cell) {
            return;
        }

        const status = cell.revealStatus();
        
        if (status > 0) {
            evt.currentTarget.innerHTML = status;
        } else if (status === 0) {
            evt.currentTarget.attributes['class'].nodeValue += ' empty';
        } else if (status === -1) {
            evt.currentTarget.attributes['class'].nodeValue += ' mined';
            this._endGame();
        }
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
