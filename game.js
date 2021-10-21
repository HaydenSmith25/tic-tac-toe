let turn = 0;
let shotClock = 15;
let myShotClockInterval;

const gameMsg = document.getElementById("gameMsg");

const timer = document.getElementById("timer");

timer.innerText = String(shotClock);

const board = new Array(9).fill(null).map((val, idx) => {
  return `<div class="square" id="${"square-" + (idx + 1)}"></div>`;
});

const app = document.getElementById("app");
app.innerHTML = board.join("");

const boardSquares = Array.from(document.querySelectorAll(".square"));

boardSquares.forEach((node, idx) => {
  if (idx % 3 === 0) {
    node.classList.add("column1");
  } else if ((idx + 1) % 3 === 0) {
    node.classList.add("column3");
  } else {
    node.classList.add("column2");
  }
});

// in order to delegate these events
// we're going to attach ONE event listener to a DOM node that's a parent to all of them
// (at least) >> we could attach it even higher...

app.addEventListener("click", (event) => {
  if (myShotClockInterval) {
    shotClock = 15;
    clearInterval(myShotClockInterval);
  }

  myShotClockInterval = setInterval(() => {
    timer.innerText = shotClock;
    shotClock--;
    if (shotClock === 0) {
      gameMsg.innerText = "Sorry, too slow :/ you have lost :(";
      clearInterval(myShotClockInterval);
    }
  }, 1000);

  const node = event.target;

  if (node.innerText) {
    return;
  }

  // we setup a way to store and apply moves based on clicks
  let move;

  if (turn % 2 === 0) {
    move = "X";
  } else {
    move = "O";
  }

  // we modify the current node by adding its move to the node's .innerText property
  node.innerText = move;
  turn++;

  // check if anyone won
  didWin();
});

// we need to know if any 3 squares vertical, horizontal, or diagonal constitute a win
// meaning that they all have the same value as their innerText

function didWin() {
  // naively we know that there are only 8 ways to win
  // so let's just run each scenario and check if a win occurred

  const rows = [
    [...boardSquares.slice(0, 3)],
    [...boardSquares.slice(3, 6)],
    [...boardSquares.slice(6)],
  ];

  const column1 = Array.from(document.querySelectorAll(".column1"));
  const column2 = Array.from(document.querySelectorAll(".column2"));
  const column3 = Array.from(document.querySelectorAll(".column3"));

  const columns = [column1, column2, column3];

  const diagonal1 = Array.from(
    document.querySelectorAll("#square-1, #square-5, #square-9")
  );

  const diagonal2 = Array.from(
    document.querySelectorAll("#square-3, #square-5, #square-7")
  );

  const diagonals = [diagonal1, diagonal2];

  [rows, columns, diagonals].forEach((category) => {
    // does each node in each array in the category have the same innerText value?

    category.forEach((combination) => {
      // combination looks like this [ node1, node2, node3 ]
      // each of node1-3 is a DOM node or object in the Document Object Model

      const allX = (combo) => {
        let result = true;

        for (let i = 0; i < combo.length; i++) {
          const currNode = combo[i];

          if (currNode.innerText === "O" || currNode.innerText === "") {
            result = false;
          }
        }

        return result;
      };

      const allO = (combo) => {
        for (let i = 0; i < combo.length; i++) {
          const currNode = combo[i];
          if (currNode.innerText === "X" || currNode.innerText === "") {
            return false;
          }
        }
        return true;
      };

      let won = false;

      won = allX(combination) || allO(combination);

      // now we know whether somebody won or not
      // IF we have winner, let's update that DOM node that contains our winning message

      if (won) {
        gameMsg.innerText = "You won!";
        clearInterval(myShotClockInterval);
        document.getElementById("timeLeftMsg").innerText = "";
        timer.innerText = "";
      }
    });
  });
}
