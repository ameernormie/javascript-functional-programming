function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

// match :: RegExp -> String -> Boolean
const match = curry((re, str) => re.test(str));

// inspect :: a -> String
const inspect = x => {
  if (x && typeof x.inspect === "function") {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    switch (typeof t) {
      case "string":
        return `'${t}'`;
      case "object": {
        const ts = Object.keys(t).map(k => [k, inspect(t[k])]);
        return `{${ts.map(kv => kv.join(": ")).join(", ")}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args)
      ? `[${args.map(inspect).join(", ")}]`
      : inspectTerm(args);
  }

  return typeof x === "function" ? inspectFn(x) : inspectArgs(x);
};

/**
 * Container
 */
class Container {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Container(x);
  }
}

class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  inspect() {
    return this.isNothing ? "Nothing" : `Just(${inspect(this.$value)})`;
  }
}

/**
 * Functor
 */

// (a -> b) -> Container a -> Container b
Container.prototype.map = function(f) {
  return Container.of(f(this.$value));
};

console.log(Container.of(4).map(x => x * x));

console.log(Maybe.of("Malkovich").map(match(/a/g)));
