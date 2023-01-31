import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

class Card {
  row = 0;
  col = 0;
  color = '#fff';
  num = null;

  constructor(col, row, num) {
    this.row = row;
    this.col = col;
    this.num = num;
    this.getColorByNum();
  }

  getColorByNum() {
    return '#fff';
  }
}

const DEFAULT_DATA = [[0, 0, 0, 0], [0, 0, 2, 4], [0, 0, 2, 8], [0, 0, 0, 0]].map((item, index) => {
  const newData = item.map((card, cardIndex) => (new Card(cardIndex, index, card)));
  return newData;
}
);
const KEYCODE_TYPES = {
  37: 'left',
  38: 'top',
  39: 'right',
  40: 'bottom'
};

function Content() {
  const [data, setData] = useState(DEFAULT_DATA);
  // 监听键盘事件, 判断当前位置, 和起始点的位置, 得出上下左右方位.
  window.addEventListener('keydown', (event) => {
    const e = event || window.event;
    onMove(KEYCODE_TYPES[e.keyCode]);
  });

  const onMove = (direc) => {
    const flatData = JSON.parse(JSON.stringify(data)).flat();
    console.log(flatData, 'flatData');
    flatData.forEach((card) => {
      onCardMove({row: card.row, col: card.col}, {
        row: direc === 'top' ? card.row - 1 : direc === 'bottom' ? card.row + 1 : card.row,
        col: direc === 'left' ? card.col - 1 : direc === 'right' ? card.col + 1 : card.col
      }, direc);
    });
  };

  /* 方位事件中, 判断当前的值是不是和目标值相等, 
   if相等则加和, 更新两个数据, 并且判断1.等于2048, 则提示胜出 2.无2048, 并且没有空格, 则提示失败 3. 无2048, 并且有空格, 产生一个数据, else不等不动. */
   const onCardMove = (valueCell, targetCell, direc) => {
    if (targetCell.col < 0 || targetCell.row < 0 || targetCell.col > 3 || targetCell.row > 3) return;

    const currentCard = data[valueCell.row][valueCell.col];
    const targetCard = data[targetCell.row][targetCell.col];

    const value = currentCard.num;
    const targetValue = targetCard.num;

    console.log(value, targetValue, 'value');

    if (!value || value === 0 
      || (targetValue !== 0 && value !== targetValue)) {
      return;
    }

    // 替换
    if (targetValue === 0)  {
      const newData = data;
      newData[valueCell.row][valueCell.col].num = 0;
      newData[targetCell.row][targetCell.col].num = value + targetValue;
      setData([...newData]);
      onCardMove(targetCell, {
        row: direc === 'top' ? targetCell.row - 1 : direc === 'bottom' ? targetCell.row + 1 : targetCell.row,
        col: direc === 'left' ? targetCell.col - 1 : direc === 'right' ? targetCell.col + 1 : targetCell.col
      }, direc);
      return;
    }

    // 合并
    const newData = data;
    newData[valueCell.row][valueCell.col].num = 0;
    newData[targetCell.row][targetCell.col].num = value + targetValue;
    setData([...newData]);

    if (newData.find((item) => item.find((cell) => cell === 2048))) {
      alert("胜出!");
      return;
    }
    if (newData.find((item) => item.find((cell) => !cell))) {
      alert("失败了!");
      setData(DEFAULT_DATA);
      return;
    }
    const randomData = [2, 4][Math.floor(Math.random() * 2)];
    const emptyPointList = newData.map(line => (line.filter(point => point.num === 0))).flat();
    const randomEmptyCell = emptyPointList[Math.floor(Math.random() * emptyPointList.length)];
    newData[randomEmptyCell.row][randomEmptyCell.col].num = randomData;
    setData([...newData]);
  };

  return <table>
    <tbody>
      {
        data.map((item, index) => {
          return <tr key={index}>
            {
              item.map((cell, cellIndex) => {
                return <th key={cellIndex}>{cell.num}</th>
              })
            }
          </tr>
        })
      }
    </tbody>
    </table>
}

function Score() {
  return <div>得分: </div>
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        {/* <div className="game-info">
          <Info></Info>
        </div> */}
        <Content />
        {/* <Score /> */}
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
