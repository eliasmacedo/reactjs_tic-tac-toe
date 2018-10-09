import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//This can be refactored as the function below
//class Square extends React.Component {
//  render() {
//    return (
//      <button 
//      	className="square" 
//      	onClick={() => this.props.squareCallback()}
//  	  >
//        {this.props.value}
//      </button>
//    );
//  }
//}
function Square(props) {
  return(
    <button className={"square"+" "+props.className} onClick={props.clickCallback}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return <Square key={i} value={this.props.squares[i]}  className={winner===true ? 'winning-tile' : ''}
    			   clickCallback={() => this.props.clickCallback(i)} />;
  }
  render() {
    let squareDivs = [];
    let parentDivs = [];
    let index      = 0;
    let winner     = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        winner = (this.props.winningCombo.indexOf(index)>=0) ? true : false;
        squareDivs = squareDivs.concat(this.renderSquare(index, winner));
        index++;
      }
      parentDivs = parentDivs.concat(<div key={i} className="board-row">{squareDivs}</div>);
      squareDivs = [];
    }
    return (
      <div>
        {parentDivs}
      </div>
    );
  }
}

class Game extends React.Component {
  //all React component classes that have a constructor should start it with a super(props) call.
  constructor(props) {
    super(props);
    //state should be considered as private to the component that it’s defined in
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: {player: null, index: null}
      }],
      xIsNext: true,
      stepNumber: 0
    };
    this.gameWon = false;
  }
  clickCallback(i) {
    // if we “go back in time” and then make a new move from that point, we throw away all the “future” history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const char    = this.state.xIsNext ? 'X' : 'O';
    if ( this.gameWon || squares[i]) {
     return;
    }
    squares[i] = char
    this.setState({
      //unlike push, concat doesn’t mutate the original array. It's preffered
      history: history.concat([{squares: squares, move:{player: char, index: i}}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    this.gameWon = false;
  }
  render() {
    const history = this.state.history;
    //makes sure to always render the selected step
    const current = history[this.state.stepNumber];
    const winner = determineWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to start';

      return (
        <li key={move} className={(move === this.state.stepNumber) ? 'current-step' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>{move ? step.move.player+'('+indexToPos(step.move.index)+')' : ''}
        </li>
      );
    });

    let status;
    if (winner) {
      if (winner.player) {
        status = 'Winner: ' + winner.player;
      } else {
        status = 'Draw Game';
      }
      this.gameWon = true;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-info">
          <div className="game-status">
            {status}
          </div>
          <div className="game-board">
            <Board
              squares={current.squares}
              winningCombo={winner ? winner.combo : []}
              clickCallback={(i) => this.clickCallback(i)}
            />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function determineWinner(squares) {
  //below are the possible lines that can be formed to win
  //3 horizontal, 3 vertical and 2 diagonal
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let allSquaresFilled = true; 
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //winner found
      return {player: squares[a], combo: lines[i]};
    } else if(squares[a] === null || squares[b] === null || squares[c] === null) {
      //game not over yet
      allSquaresFilled = false;
    }
  }
  if (allSquaresFilled) {
    return {player: null, combo: []}
  } else {
    return null;
  }
}
function indexToPos(index) {
  let row,col;
  if(index<3){
    row=1;
    col=index+1;
  }else if(index<6){
    row=2;
    col=index-row;
  }else if(index<9){
    row=3;
    col=index-row;
  }
  return(''+col+','+row);
}

// ========================================
//ReactDOM.render(x,y) render component x in element y
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
