# Minesweeper

This is a test for a minesweeper developed with Angular 7.

## Try it locally
Once you've cloned or downloaded this repo, run `npm i` in the root directory. Then, run `ng serve --open` to build the app and your default browser will automatically pop up with the app running in port 4200. If you want to switch to a different port, simply modify the `package.json` and modify the `start` script with `"start": "ng serve --port=3000"` -where 3000 is the port you want to use.

## What's done:
- When a cell with no adjacent mines is revealed, all adjacent squares will be revealed
- Ability to 'flag' a cell with a question mark or red flag
- Alert when game is over
- Time tracking
- Ability to start a new game and preserve/resume the old ones
- Ability to select the game parameters: number of rows, columns, and mines
- Nice user experience (eg avoid page reload while playing)

## TODOs
- Improve some performance when revealing all adjacent cells
- Allow multi user
- Allow storage and persistance.

## See it working
In order to run what's in this repo and become a player of this game, [please click here](https://minesweeper-asiles.herokuapp.com/) and you will be taken to the app deployed in Heroku.

[https://minesweeper-asiles.herokuapp.com/](https://minesweeper-asiles.herokuapp.com/)

## Further help
To get more information about this or any question, please reach out to `agustinsiles10@gmail.com`
