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
    @Output() onCellClicked: EventEmitter<any> = new EventEmitter();
    
    columnList: Array<number>;
    rowList: Array<number>;

    constructor(private _dataService: DataService) {}
    
    ngOnInit(): void {
        this.columnList = Array(this.game.columns).fill(1).map((x,i) => i + 1);
        this.rowList = Array(this.game.rows).fill(1).map((x,i) => i + 1);
    }

    onClicked(evt): void { 
        const coordenates = (evt.target.attributes['coordenates'].value).split(',');
        const [ xPosition, yPosition ] = coordenates;
        const cell: Cell = this._dataService.getCellByCoordenate([+xPosition, +yPosition]);

        if (!cell) {
            return;
        }

        const status = cell.revealStatus();
        
        if (status > 0) {
            evt.currentTarget.innerHTML = status;
        } else {
            const classStatus = status === 0 ? 'empty' : 'mined';
            evt.currentTarget.attributes['class'].nodeValue += ` ${classStatus}`;
        }
    }
}
