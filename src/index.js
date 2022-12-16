import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
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

class Info extends React.Component {
  render() {
    return (
      <div>
        <p>2048</p>
        <p>试试游戏吧~</p>
      </div>
    );
  }
}

const DEFAULT_DATA = [[0, 0, 0, 0, 0], [0, 0, 2, 4, 0], [0, 0, 2, 8, 0], [0, 0, 0, 0, 0]];
function Content() {
  const [data, setData] = useState(DEFAULT_DATA);
  // 监听鼠标事件, 判断当前位置, 和起始点的位置, 得出上下左右方位.
  // 方位事件中, 判断当前的值是不是和目标值相等, if相等则加和, 更新两个数据, 并且判断1.等于2048, 则提示胜出 2.无2048, 并且没有空格, 则提示失败 3. 无2048, 并且有空格, 产生一个数据, else不等不动.

  const onMove = (valueCell = '2-1', targetCell = '2-2') => {
    const value = data[+valueCell.split('-')[0]][+valueCell.split('-')[1]];
    const targetValue = data[+targetCell.split('-')[0]][+targetCell.split('-')[1]];

    if (!value || value !== targetValue) {
      return;
    }

    const newData = data;
    newData[+valueCell.split('-')[0]][+valueCell.split('-')[1]] = 0;
    newData[+targetCell.split('-')[0]][+targetCell.split('-')[1]] = targetValue * 2;
    setData([...newData]);

    if (newData.find(item => item.find(cell => cell === 2048))) {
      alert('胜出!');
      return;
    }
    if (newData.find(item => item.find(cell => !cell))) {
      alert('失败了!');
      setData(DEFAULT_DATA);
      return;
    }
    const randomData = [2, 4][Math.floor(Math.randomData * 2)];
    newData[+valueCell.split('-')[0]][+valueCell.split('-')[1]] = randomData;
    setData([...newData]);
  };

  return <table>
      {
        data.map((item, index) => {
          return <tr key={index}>
            {
              item.map((cell, cellIndex) => {
                return <th key={cellIndex}>{cell}</th>
              })
            }
          </tr>
        })
      }
    </table>
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-info">
          <Info></Info>
        </div>
        <Content />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
