import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import classNames from 'classnames';

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

function Content({onDataChange}) {
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    // 监听键盘事件, 判断当前位置, 和起始点的位置, 得出上下左右方位.移动和新增
    window.addEventListener('keydown', (event) => {
      const e = event || window.event;
      if (Object.keys(KEYCODE_TYPES).includes(e.keyCode.toString())) {
        onMove(KEYCODE_TYPES[e.keyCode]);
        onCreate();
      }
    });
    return () => {
      window.removeEventListener('keydown', {});
    }
  }, []);

  useEffect(() => {
    onDataChange(data);
  }, [data]);

  const onMove = (direc) => {
    const flatData = JSON.parse(JSON.stringify(data)).flat();
    flatData.forEach((card) => {
      onCardMove({row: card.row, col: card.col}, {
        row: direc === 'top' ? card.row - 1 : direc === 'bottom' ? card.row + 1 : card.row,
        col: direc === 'left' ? card.col - 1 : direc === 'right' ? card.col + 1 : card.col
      }, direc);
    });
  };

  /* 方位事件中, 判断当前的值是不是和目标值相等, 
   if相等则加和, 更新两个数据, 并且判断1.等于2048, 则提示胜出 2.无2048, 并且没有空格, 则提示失败 3. 无2048, 并且有空格, 产生一个数据, else不等不动. */
   const onCardMove = (valueCell, targetCell, direc, isCreate) => {
    if (targetCell.col < 0 || targetCell.row < 0 || targetCell.col > 3 || targetCell.row > 3) return;

    const currentCard = data[valueCell.row][valueCell.col];
    const targetCard = data[targetCell.row][targetCell.col];

    const value = currentCard.num;
    const targetValue = targetCard.num;
    const newData = data;

    if (!value || value === 0 
      || (targetValue !== 0 && value !== targetValue)) {
      return;
    }

    // 替换
    if (targetValue === 0)  {
      newData[valueCell.row][valueCell.col].num = 0;
      newData[targetCell.row][targetCell.col].num = value + targetValue;
      setData([...newData]);
      onCardMove(targetCell, {
        row: direc === 'top' ? targetCell.row - 1 : direc === 'bottom' ? targetCell.row + 1 : targetCell.row,
        col: direc === 'left' ? targetCell.col - 1 : direc === 'right' ? targetCell.col + 1 : targetCell.col
      }, direc);
      return;
    }

    if (newData.find((item) => item.find((cell) => cell === 2048))) {
      alert("胜出!");
      return;
    }
    if (newData.find((item) => item.find((cell) => !cell))) {
      alert("失败了!");
      setData(DEFAULT_DATA);
      return;
    }

    // 合并
    newData[valueCell.row][valueCell.col].num = 0;
    newData[targetCell.row][targetCell.col].num = value + targetValue;
    setData([...newData]);
  };

  const onCreate = () => {
    const newData = data;
    const randomData = [2, 4][Math.floor(Math.random() * 2)];
    const emptyPointList = newData.map(line => (line.filter(point => point.num === 0))).flat();
    const randomEmptyCell = emptyPointList[Math.floor(Math.random() * emptyPointList.length)];
    newData[randomEmptyCell.row][randomEmptyCell.col].num = randomData;
    setData([...newData]);
  };

  return <table className="board-table">
    <tbody>
      {
        data.map((item, index) => {
          return <tr key={index}>
            {
              item.map((cell, cellIndex) => {
                return <th key={cellIndex} className={classNames('cell', `cell-${cell.num}`)}>{cell.num !== 0 ? cell.num : undefined}</th>
              })
            }
          </tr>
        })
      }
    </tbody>
    </table>
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = { maxData: 0 };
  }
  getMaxNum (data){
    const sortData = data.flat().sort((a, b) => b.num - a.num);
    this.setState({ maxData: sortData?.length > 0 ? sortData[0].num : 0});
  }

  render() {
    return (
      <div className="game">
        <div className="score">SCORE <span>{this.state.maxData}</span></div>
        <Content onDataChange={(data) => this.getMaxNum(data)} />
      </div>
    );
  }
}

// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
