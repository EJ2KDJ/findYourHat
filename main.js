const keypress = require('keypress');

// Make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.currentPos = this.initialPlayerPosition();
    this.print();
  }

  print() {
    console.clear();
    for (let arr of this.field) {
      console.log(arr.join(""));
    }
  }

  initialPlayerPosition() {
    for (let rowIndex = 0; rowIndex < this.field.length; rowIndex++) {
      let colIndex = this.field[rowIndex].indexOf(pathCharacter);
      if (colIndex !== -1) {
        return [rowIndex, colIndex];
      }
    }
    return null;
  }

  isValidMove(row, col) {
    return row >= 0 && row < this.field.length && col >= 0 && col < this.field[0].length;
  }

  movePlayer(newRow, newCol) {
    if (this.isValidMove(newRow, newCol)) {
      if (this.field[newRow][newCol] === hole) {
        console.log("You fell into a hole! Game over.");
        process.exit();
      }

      if (this.field[newRow][newCol] === hat) {
        console.log("You found your hat! YOU WIN!");
        process.exit();
      }

      this.field[this.currentPos[0]][this.currentPos[1]] = pathCharacter;
      this.currentPos = [newRow, newCol];
      this.field[newRow][newCol] = '*';
      this.print();
    } else {
      console.log("Invalid move. You are out of bounds!");
    }
  }

  handleInput(char) {
    const [currentRow, currentCol] = this.currentPos;
    let newRow = currentRow;
    let newCol = currentCol;

    if (char === "w") {
      newRow--;
    } else if (char === "s") {
      newRow++;
    } else if (char === "a") {
      newCol--;
    } else if (char === "d") {
      newCol++;
    } else {
      console.log("Use w (up), s (down), a (left), d (right) to move.");
      return;
    }

    this.movePlayer(newRow, newCol);
  }

  static generateField(height, width, percentage = 20) {
    const field = Array.from({ length: height }, () => Array(width).fill(fieldCharacter));

    field[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;

    const totalCells = height * width;
    const holeCount = Math.floor((percentage / 100) * totalCells);

    for (let i = 0; i < holeCount; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * height);
        col = Math.floor(Math.random() * width);
      } while (field[row][col] !== fieldCharacter);
      field[row][col] = hole;
    }

    let playerPos;
    do {
      playerPos = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
    } while (field[playerPos[0]][playerPos[1]] !== fieldCharacter);
    field[playerPos[0]][playerPos[1]] = pathCharacter;

    return field;
  }
}

// Example: Generating a 10x10 field with 20% holes
const randomField = Field.generateField(10, 10);
const myField = new Field(randomField);

process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  } else {
    myField.handleInput(ch);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();