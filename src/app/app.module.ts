import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MinesweeperTableComponent } from './components/minesweeper-table/minesweeper-table.component';

@NgModule({
    declarations: [
        AppComponent,
        MinesweeperTableComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
