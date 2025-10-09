"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Operator = "/" | "*" | "+" | "-";

const performCalculation = {
  "/": (first: number, second: number) => first / second,
  "*": (first: number, second: number) => first * second,
  "+": (first: number, second: number) => first + second,
  "-": (first: number, second: number) => first - second,
};

export function CalcZilla() {
  const [displayValue, setDisplayValue] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const handleOperator = (nextOperator: Operator) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultString);
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(displayValue);
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultString);
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleClear = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleMemory = (memOp: "M+" | "M-" | "MS" | "MR") => {
    const inputValue = parseFloat(displayValue);
    switch (memOp) {
      case "M+":
        setMemory(memory + inputValue);
        break;
      case "M-":
        setMemory(memory - inputValue);
        break;
      case "MS":
        setMemory(inputValue);
        break;
      case "MR":
        setDisplayValue(String(memory));
        setWaitingForSecondOperand(false);
        break;
    }
  };

  const displayFontSize = useMemo(() => {
    const len = displayValue.length;
    if (len > 18) return "text-2xl";
    if (len > 12) return "text-3xl";
    if (len > 8) return "text-4xl";
    return "text-6xl";
  }, [displayValue]);

  const buttonBaseClasses = "text-3xl h-16 rounded-2xl active:scale-95 transition-transform duration-100 focus-visible:ring-offset-black";
  const functionButtonClasses = `${buttonBaseClasses} bg-zinc-700 text-white hover:bg-zinc-600`;
  const operatorButtonClasses = `${buttonBaseClasses} bg-primary text-primary-foreground hover:bg-primary/90 text-4xl`;
  const numberButtonClasses = `${buttonBaseClasses} bg-zinc-800 text-white hover:bg-zinc-700`;
  const equalsButtonClasses = `${buttonBaseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;

  return (
    <Card className="w-full max-w-xs p-4 bg-black border-0 shadow-2xl shadow-primary/10">
      <CardContent className="p-0">
        <div className="text-right mb-4 h-24 flex items-end justify-end">
          <h1 className={`font-light text-white break-all leading-tight ${displayFontSize}`}>
            {displayValue}
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={handleClear} className={`${functionButtonClasses} text-primary`}>AC</Button>
          <Button onClick={() => handleMemory("M+")} className={functionButtonClasses}>M+</Button>
          <Button onClick={() => handleMemory("M-")} className={functionButtonClasses}>M-</Button>
          <Button onClick={() => handleOperator("/")} className={operatorButtonClasses}>÷</Button>
          
          <Button onClick={() => inputDigit("7")} className={numberButtonClasses}>7</Button>
          <Button onClick={() => inputDigit("8")} className={numberButtonClasses}>8</Button>
          <Button onClick={() => inputDigit("9")} className={numberButtonClasses}>9</Button>
          <Button onClick={() => handleOperator("*")} className={operatorButtonClasses}>×</Button>
          
          <Button onClick={() => inputDigit("4")} className={numberButtonClasses}>4</Button>
          <Button onClick={() => inputDigit("5")} className={numberButtonClasses}>5</Button>
          <Button onClick={() => inputDigit("6")} className={numberButtonClasses}>6</Button>
          <Button onClick={() => handleOperator("-")} className={operatorButtonClasses}>−</Button>
          
          <Button onClick={() => inputDigit("1")} className={numberButtonClasses}>1</Button>
          <Button onClick={() => inputDigit("2")} className={numberButtonClasses}>2</Button>
          <Button onClick={() => inputDigit("3")} className={numberButtonClasses}>3</Button>
          <Button onClick={() => handleOperator("+")} className={operatorButtonClasses}>+</Button>
          
          <Button onClick={() => inputDigit("0")} className={`${numberButtonClasses} col-span-2`}>0</Button>
          <Button onClick={inputDecimal} className={numberButtonClasses}>.</Button>
          <Button onClick={handleEquals} className={equalsButtonClasses}>=</Button>
          
          <Button onClick={() => handleMemory("MS")} className={`${functionButtonClasses} col-span-2`}>MS</Button>
          <Button onClick={() => handleMemory("MR")} className={`${functionButtonClasses} col-span-2`}>MR</Button>
        </div>
      </CardContent>
    </Card>
  );
}
