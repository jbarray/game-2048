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
  x = 0;
  y = 0;
  color = '#fff';
  num = null;
  merged = false;

  constructor(x, y, num) {
    this.x = x;
    this.y = y;
    this.num = num;
    this.getColorByNum();
  }

  getColorByNum() {
    return '#fff';
  }

  setMerged(value) {
    this.merged = value;
  }
}

const DEFAULT_DATA = [[0, 0, 0, 0, 0], [0, 0, 2, 4, 0], [0, 0, 2, 8, 0], [0, 0, 0, 0, 0]].map((item, index) => {
  const newData = item.map((card, cardIndex) => (new Card(cardIndex, 3 - index, card)));
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
      console.log({x: card.x, y: card.y}, {
        x: direc === 'left' ? card.x - 1 : direc === 'right' ? card.x + 1 : card.x,
        y: direc === 'top' ? card.y + 1 : direc === 'bottom' ? card.y - 1 : card.y
      }, 'value, target');
      onCardMove({x: card.x, y: card.y}, {
        x: direc === 'left' ? card.x - 1 : direc === 'right' ? card.x + 1 : card.x,
        y: direc === 'top' ? card.y + 1 : direc === 'bottom' ? card.y - 1 : card.y
      });
    });
  };

  /* 方位事件中, 判断当前的值是不是和目标值相等, 
   if相等则加和, 更新两个数据, 并且判断1.等于2048, 则提示胜出 2.无2048, 并且没有空格, 则提示失败 3. 无2048, 并且有空格, 产生一个数据, else不等不动. */
   const onCardMove = (valueCell, targetCell) => {
    if (targetCell.x < 0 || targetCell.y < 0 || targetCell.x > 4 || targetCell.y > 3) return;

    const currentCard = data[3 - valueCell.y][valueCell.x];
    const targetCard = data[3 - targetCell.y][targetCell.x];
    const currentPoint = `${3 - valueCell.y}-${valueCell.x}`;
    const targetPoint = `${3 - targetCell.y}-${targetCell.x}`;

    const value = currentCard.num;
    const targetValue = targetCard.num;

    console.log(value, targetValue, 'value');

    if (!value || value === 0 || value !== targetValue || currentCard.merged) {
      return;
    }

    const newData = data;
    newData[currentPoint.split('-')[0]][currentPoint.split('-')[1]].num = 0;
    newData[targetPoint.split('-')[0]][targetPoint.split('-')[1]].num = value + targetValue;
    console.log(newData, "data");
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
    const randomData = [2, 4][Math.floor(Math.randomData * 2)];
    // newData[currentPoint.split('-')[0]][currentPoint.split('-')[1]].num = randomData;
    setData([...newData]);
  };

  return <table>
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
