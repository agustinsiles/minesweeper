import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from '@app/app.component';
import { MinesweeperTableComponent } from '@app/components/minesweeper-table/minesweeper-table.component';

@NgModule({
    declarations: [
        AppComponent,
        MinesweeperTableComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
