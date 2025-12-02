import { input } from './input';

const commands = input.split('\n');

let val = 50;
let count = 0;

const updateVal = (command: string) => {
  const amount = Number(command.slice(1));
  if (command[0] === 'R') {
    val += amount;
  } else {
    val -= amount;
  }
  while (val < 0) val += 100;
  while (val > 99) val -= 100;
  if(val === 0) count++;
}

commands.forEach(updateVal);
console.log(count);

const step = (s: number) => {
  val += s;
  while (val < 0) val += 100;
  while (val > 99) val -= 100;
  if(val === 0) count++;
}

const updateValP2 = (command: string) => {
  const amount = Number(command.slice(1));
  if (command[0] === 'R') {
    for(let i = 0; i < amount; i++) {
      step(1);
    }
  } else {
    for(let i = 0; i < amount; i++) {
      step(-1);
    }
  }
}

count = 0;
val = 50;
commands.forEach(updateValP2);

console.log(count);