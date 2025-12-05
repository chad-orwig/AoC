import { input } from './input';

class Range {
  min!: number;
  max!: number;
  constructor(min: number, max: number);
  constructor(str: string);
  constructor(...args: any[]) {
    if (args.length === 2) {
      this.initNumbers(args[0], args[1]);
    } else {
      this.initString(args[0]);
    }
  }
  private initNumbers(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
  private initString(str: string) {
    const [min, max] = str.split('-').map(Number) as [number, number];
    this.initNumbers(min, max);
  }
  public contains(num: number) {
    return num >= this.min && num <= this.max;
  }
  public get length() {
    return this.max - this.min + 1;
  }
  private mergable(range: Range) {
    return (this.min >= range.min && this.min <= range.max)
      || (this.max >= range.min && this.max <= range.max)
  }
  public mergeIn(ranges: Range[]) {
    const range = ranges.find(range => this.mergable(range));
    if (range) {
      range.min = Math.min(range.min, this.min);
      range.max = Math.max(range.max, this.max);
      return true;
    }
    else {
      return false;
    }
  }
}

const [rangesInput, ingredientInput] = input.split('\n\n') as [string, string];
const ranges = rangesInput?.split('\n')
  .map(line => new Range(line));

const isFresh = (id: number) => {
  return ranges.find(range => range.contains(id));
}

const ingredientIds = ingredientInput.split('\n')
  .map(Number);

const p1 = ingredientIds.filter(isFresh).length;

console.log(p1);

const finalizedRanges = [];

while(ranges.length) {
  const range = ranges.pop() as Range;
  if (!range.mergeIn(ranges) && ! range.mergeIn(finalizedRanges)) {
    finalizedRanges.push(range);
  }
}

const p2 = finalizedRanges.reduce((sum, range) => sum + range.length, 0);

console.log(p2);