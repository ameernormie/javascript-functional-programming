function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));

const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;

/**
 * Composition of two functions return a new function
 * duh!!!
 */
const shout = compose(
  exclaim,
  toUpperCase
);

console.log(shout("Hey i am shouting"));

// associativity
// compose(f, compose(g, h)) === compose(compose(f, g), h);

const head = x => x[0];
const reverse = reduce((acc, x) => [x].concat(acc), []);
const last = compose(
  head,
  reverse
);

console.log(last(["hey", "what", "is", "happening"]));

const loudLastUpper = compose(
  exclaim,
  toUpperCase,
  head,
  reverse
);

console.log(loudLastUpper(["umm", "hey", "loudlast"]));

// -- or ---------------------------------------------------------------

// const last = compose(head, reverse);
// const loudLastUpper = compose(exclaim, toUpperCase, last);

// -- or ---------------------------------------------------------------

// const last = compose(head, reverse);
// const angry = compose(exclaim, toUpperCase);
// const loudLastUpper = compose(angry, last);

/**
 * POINT FREE
 * It means functions that never mention the data upon which they operate.
 */

const snakeCase = word => word.toLowerCase().replace(/\s+/gi, "_");
