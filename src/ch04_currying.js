// import { curry } from "./utils";

export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));

console.log(match(/r/g, "hello world"));

const hasLetterR = match(/r/g);

console.log(hasLetterR("hello world"));
console.log(hasLetterR("no it does not"));

console.log(filter(hasLetterR, ["hello world", "what what", "with r r"]));

const removeStringsWithR = filter(hasLetterR);
console.log(removeStringsWithR(["rock and roll", "what what", "with r"]));

const noVowels = replace(/[aeiou]/gi);
const censored = noVowels("*");
console.log(censored("Hey this is a censored sentence"));
