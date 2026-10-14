import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface DisguiseModeProps {
  onExit: () => void;
}

export const DisguiseMode: React.FC<DisguiseModeProps> = ({ onExit }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [secretTapCount, setSecretTapCount] = useState(0);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setWaitingForOperand(false);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    // Check secret unlock code: if input was 911 or 1234 or 9999 and op is =
    if (nextOp === '=' && (display === '1234' || display === '911' || display === '0000')) {
      onExit();
      return;
    }

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const current = prevValue || 0;
      let result = current;

      switch (operator) {
        case '+': result = current + inputValue; break;
        case '-': result = current - inputValue; break;
        case '×': result = current * inputValue; break;
        case '÷': result = inputValue !== 0 ? current / inputValue : 0; break;
      }

      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOp === '=' ? null : nextOp);
  };

  const handleSecretTap = () => {
    const newCount = secretTapCount + 1;
    if (newCount >= 3) {
      onExit();
    } else {
      setSecretTapCount(newCount);
      setTimeout(() => setSecretTapCount(0), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-end p-4 max-w-md mx-auto select-none font-sans">
      {/* Top status bar looking like an iOS / Android utility calculator */}
      <div className="flex items-center justify-between px-3 py-2 text-slate-500 text-xs">
        <button 
          onClick={handleSecretTap} 
          className="hover:text-slate-400 active:text-white transition-colors"
          title="Mode indicator"
        >
          RAD
        </button>
        {/* Discreet exit button disguised as a small lock icon */}
        <button 
          onClick={onExit} 
          className="text-slate-700 hover:text-slate-400 p-2"
          title="Exit disguise"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>

      {/* Calculator Display */}
      <div className="px-4 py-8 text-right overflow-hidden">
        <div className="text-slate-400 text-sm h-6">
          {prevValue !== null && operator ? `${prevValue} ${operator}` : ''}
        </div>
        <div className="text-6xl font-light tracking-tight text-white truncate">
          {display}
        </div>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-3 pb-6">
        {/* Row 1 */}
        <button
          onClick={clearAll}
          className="h-18 rounded-full bg-slate-400/80 hover:bg-slate-300 text-black font-semibold text-2xl transition-colors active:opacity-75"
        >
          AC
        </button>
        <button
          onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(v * -1));
          }}
          className="h-18 rounded-full bg-slate-400/80 hover:bg-slate-300 text-black font-semibold text-2xl transition-colors active:opacity-75"
        >
          ±
        </button>
        <button
          onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(v / 100));
          }}
          className="h-18 rounded-full bg-slate-400/80 hover:bg-slate-300 text-black font-semibold text-2xl transition-colors active:opacity-75"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className="h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-2xl transition-colors active:opacity-75"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => inputDigit('7')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          9
        </button>
        <button
          onClick={() => performOperation('×')}
          className="h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-2xl transition-colors active:opacity-75"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputDigit('4')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          6
        </button>
        <button
          onClick={() => performOperation('-')}
          className="h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-2xl transition-colors active:opacity-75"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => inputDigit('1')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          3
        </button>
        <button
          onClick={() => performOperation('+')}
          className="h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-2xl transition-colors active:opacity-75"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal text-left pl-7 transition-colors active:opacity-75"
        >
          0
        </button>
        <button
          onClick={inputDot}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-2xl font-normal transition-colors active:opacity-75"
        >
          .
        </button>
        <button
          onClick={() => performOperation('=')}
          className="h-18 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-2xl transition-colors active:opacity-75"
        >
          =
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-700 pb-2">
        Type 1234 then = or tap top-right lock to return
      </p>
    </div>
  );
};
