import ConfettiGenerator from 'confetti-js';
import range from 'lodash/range';
import React, { ChangeEvent, Fragment, KeyboardEvent, LegacyRef, useEffect, useState } from 'react';
import { Button, LinkButton } from '../components/buttons';
import { ProgressBar } from '../components/progress-bar';

export default function Home() {
  const [questions, setQuestions] = useState<AnyQ[]>([]);
  const [qIndex, setQIndex] = useState(-1);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (showResult) {
      const confettiSettings = { target: 'confetti-canvas' };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      return () => confetti.clear();
    }
  }, [showResult]);

  const startTest = () => {
    setQuestions(range(0, 15).map(() => generateQuestion()));
    setQIndex(0);
  };
  const goToNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col justify-center h-screen p-4 space-y-4">
        <div className="text-4xl text-center text-green-800">Well done.</div>
        <div className="flex flex-col space-y-1">
          {questions.map((q, qi) => {
            const isCorrect = q.isCorrect();
            const bg = isCorrect ? 'bg-green-100' : 'bg-red-100';
            return (
              <div key={qi} className={`text-center text-2xl ${bg}`}>
                {q.getAnsweredText()}
                {isCorrect && (
                  <span>
                    <span className="text-green-600">✓</span>
                  </span>
                )}
                {!isCorrect && (
                  <span>
                    <span className="text-red-700">✗</span>
                    &nbsp;{q.expectedAnswer}
                    <span className="text-green-600">✓</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <LinkButton url="/" type="secondary">
          Go to Home
        </LinkButton>
      </div>
    );
  } else if (qIndex === -1) {
    return (
      <div className="flex flex-col justify-center h-screen p-4 space-y-4">
        <div
          className="text-center text-indigo-600"
          style={{ fontFamily: 'Monoton', fontSize: 50 }}
        >
          MathPop
        </div>
        <Button onClick={startTest}>Start Test Now</Button>
        <LinkButton url="/" type="secondary">
          Go to Home
        </LinkButton>
      </div>
    );
  } else {
    const q = questions[qIndex];
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      q.actualAnswer = e.target.value;
      setQuestions([...questions]);
    };
    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && q.actualAnswer.trim().length > 0) {
        goToNext();
      }
    };
    const onInputRef = (ref: HTMLInputElement | null) => {
      if (ref) {
        ref.focus();
      }
    };
    return (
      <Fragment>
        <ProgressBar percent={((qIndex + 1) * 100) / questions.length} />
        <div className="flex flex-col justify-center h-screen p-4 space-y-4">
          <div className="flex justify-center space-x-5 text-3xl">
            {q.renderLHS()}
            <input
              type="number"
              className="bg-yellow-100 border-dashed border-red-500 border-b-2 w-16 text-center outline-0 focus:bg-yellow-200"
              value={q.actualAnswer}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              ref={onInputRef}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

function generateQuestion(): AnyQ {
  // const types = ['dd+d', 'dd-d', 'd*d', 'dd/d', 'half of dd'];
  // const types = ['dd-d', 'd*d', 'dd/d', 'half of dd'];
  const types = [
    // 'd*d',
    // 'dd/d',
    // '1ltddd',
    // '1ltdddd',
    // '1gtddd',
    // '1gtdddd',
    // '1ltdd0',
    // '1ltddd0',
    // '1gtdd9',
    // '1gtddd9',
    // 'd+d+d',
    // 'dd+d+d',
    // 'dd-d',
    'ddd/d',
  ];
  const type = choose(types);
  if (type === 'dd+d') {
    const num1 = int(11, 99);
    const num2 = int(2, 9);
    const ans = num1 + num2;
    return new Math2OperantQ(num1, '+', num2, ans);
  } else if (type === 'dd-d') {
    const num1 = int(11, 99);
    const num2 = int(2, 9);
    const ans = num1 - num2;
    return new Math2OperantQ(num1, '-', num2, ans);
  } else if (type === 'd*d') {
    const num1 = int(2, 9);
    const num2 = int(2, 9);
    const ans = num1 * num2;
    return new Math2OperantQ(num1, 'x', num2, ans);
  } else if (type == 'dd/d') {
    const num1 = int(2, 9);
    const num2 = int(2, 9);
    const ans = num1 * num2;
    return new Math2OperantQ(ans, '÷', num1, num2);
  } else if (type == 'half of dd') {
    const num1 = int(1, 4) * 20;
    const num2 = int(1, 4) * 2;
    const qnum = num1 + num2;
    return new MathFillQ(`Half of ${qnum} is`, qnum / 2);
  } else if (type == '1ltddd') {
    const num1 = int(100, 999);
    return new MathFillQ(`1 less than ${num1}`, num1 - 1);
  } else if (type == '1ltdddd') {
    const num1 = int(1000, 9999);
    return new MathFillQ(`1 less than ${num1}`, num1 - 1);
  } else if (type == '1gtddd') {
    const num1 = int(100, 999);
    return new MathFillQ(`1 greater than ${num1}`, num1 + 1);
  } else if (type == '1gtdddd') {
    const num1 = int(1000, 9999);
    return new MathFillQ(`1 greater than ${num1}`, num1 + 1);
  } else if (type == '1ltdd0') {
    const num1 = int(10, 99) * 10;
    return new MathFillQ(`1 less than ${num1}`, num1 - 1);
  } else if (type == '1ltddd0') {
    const num1 = int(100, 999) * 10;
    return new MathFillQ(`1 less than ${num1}`, num1 - 1);
  } else if (type == '1gtdd9') {
    const num1 = int(10, 99) * 10;
    return new MathFillQ(`1 greater than ${num1 - 1}`, num1);
  } else if (type == '1gtddd9') {
    const num1 = int(100, 999) * 10;
    return new MathFillQ(`1 greater than ${num1 - 1}`, num1);
  } else if (type == 'd+d+d') {
    const num1 = int(2, 9);
    const num2 = int(2, 9);
    const num3 = int(2, 9);
    return new MathFillQ(`${num1} + ${num2} + ${num3} = `, num1 + num2 + num3);
  } else if (type == 'dd+d+d') {
    const num1 = int(11, 90);
    const num2 = int(2, 9);
    const num3 = int(2, 9);
    return new MathFillQ(`${num1} + ${num2} + ${num3} = `, num1 + num2 + num3);
  } else if (type == 'dd-d') {
    const num1 = int(11, 90);
    const num2 = int(2, 9);
    return new MathFillQ(`${num1} - ${num2} = `, num1 - num2);
  } else if (type == 'ddd/d') {
    const num2 = int (2, 9);
    const randNum1 = int(num2 * 11, 999);
    const num1 = Math.round(randNum1 / num2) * num2;
    return new MathFillQ(`${num1} / ${num2} = `, num1 / num2);
  } else {
    throw new Error(`unknown ${type}`);
  }
}

function int(minIncluded: number, maxIncluded: number) {
  return minIncluded + Math.floor(Math.random() * (maxIncluded - minIncluded + 1));
}

function choose<T>(vals: T[]): T {
  return vals[int(0, vals.length - 1)];
}

abstract class AnyQ {
  public actualAnswer: string = '';
  constructor(public expectedAnswer: number) {}
  isCorrect() {
    const numStr = this.actualAnswer.replace(/[^0-9]/g, '');
    if (numStr.length === 0) {
      return false;
    }
    return parseInt(numStr, 10) === this.expectedAnswer;
  }
  abstract getAnsweredText(): string;
  abstract renderLHS(): React.ReactNode;
}

class Math2OperantQ extends AnyQ {
  renderLHS(): React.ReactNode {
    return (
      <Fragment>
        <div>{this.num1}</div>
        <div>{this.op}</div>
        <div>{this.num2}</div>
        <div>=</div>
      </Fragment>
    );
  }
  constructor(public num1: number, public op: string, public num2: number, expectedAnswer: number) {
    super(expectedAnswer);
  }
  getAnsweredText() {
    return `${this.num1} ${this.op} ${this.num2} = ${this.actualAnswer}`;
  }
}

class MathFillQ extends AnyQ {
  renderLHS(): React.ReactNode {
    return <div>{this.qtext}</div>;
  }
  constructor(public qtext: string, expectedAnswer: number) {
    super(expectedAnswer);
  }
  getAnsweredText() {
    return `${this.qtext} ${this.actualAnswer}`;
  }
}
