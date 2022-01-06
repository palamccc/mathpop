import ConfettiGenerator from 'confetti-js';
import range from 'lodash/range';
import { ChangeEvent, Fragment, KeyboardEvent, LegacyRef, useEffect, useState } from 'react';
import { Button, LinkButton } from '../components/buttons';
import { ProgressBar } from '../components/progress-bar';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
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
                {q.num1} {q.op} {q.num2} =
                {isCorrect && (
                  <span>
                    &nbsp;{q.actualAnswer}
                    <span className="text-green-600">✓</span>
                  </span>
                )}
                {!isCorrect && (
                  <span>
                    &nbsp;{q.actualAnswer}
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
      if (e.key === 'Enter') {
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
          <div className="flex justify-center space-x-5 text-4xl">
            <div>{q.num1}</div>
            <div>{q.op}</div>
            <div>{q.num2}</div>
            <div>=</div>
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

function generateQuestion(): Question {
  const types = ['dd+d', 'dd-d', 'd*d', 'dd/d'];
  const type = choose(types);
  if (type === 'dd+d') {
    const num1 = int(11, 99);
    const num2 = int(2, 9);
    const ans = num1 + num2;
    return new Question(num1, '+', num2, ans);
  } else if (type === 'dd-d') {
    const num1 = int(11, 99);
    const num2 = int(2, 9);
    const ans = num1 - num2;
    return new Question(num1, '-', num2, ans);
  } else if (type === 'd*d') {
    const num1 = int(2, 9);
    const num2 = int(2, 9);
    const ans = num1 * num2;
    return new Question(num1, 'x', num2, ans);
  } else {
    const num1 = int(2, 9);
    const num2 = int(2, 9);
    const ans = num1 * num2;
    return new Question(ans, '÷', num1, num2);
  }
}

function int(minIncluded: number, maxIncluded: number) {
  return minIncluded + Math.floor(Math.random() * (maxIncluded - minIncluded + 1));
}

function choose<T>(vals: T[]): T {
  return vals[int(0, vals.length - 1)];
}

class Question {
  public actualAnswer: string = '';
  constructor(
    public num1: number,
    public op: string,
    public num2: number,
    public expectedAnswer: number
  ) {}
  isCorrect() {
    const numStr = this.actualAnswer.replace(/[^0-9]/g, '');
    if (numStr.length === 0) {
      return false;
    }
    return parseInt(numStr, 10) === this.expectedAnswer;
  }
}
