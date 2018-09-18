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
    <button className="square" onClick={props.clickCallback}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} 
    			   clickCallback={() => this.props.clickCallback(i)} />;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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

    if ( this.gameWon || squares[i]) {
     return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      //unlike push, concat doesn’t mutate the original array. It's the preffered
      history: history.concat([{squares: squares}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
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
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================
//ReactDOM.render(x,y) render component x in element y
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
