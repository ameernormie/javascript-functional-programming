// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

// always :: a -> b -> a
export const always = curry((a, b) => a);

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
export const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// either :: (a -> c) -> (b -> c) -> Either a b -> c
export const either = curry((f, g, e) => {
  if (e.isLeft) {
    return f(e.$value);
  }

  return g(e.$value);
});

// identity :: x -> x
export const identity = x => x;

// inspect :: a -> String
export const inspect = x => {
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

// left :: a -> Either a b
export const left = a => new Left(a);

// liftA2 :: (Applicative f) => (a1 -> a2 -> b) -> f a1 -> f a2 -> f b
export const liftA2 = curry((fn, a1, a2) => a1.map(fn).ap(a2));

// liftA3 :: (Applicative f) => (a1 -> a2 -> a3 -> b) -> f a1 -> f a2 -> f a3 -> f b
export const liftA3 = curry((fn, a1, a2, a3) =>
  a1
    .map(fn)
    .ap(a2)
    .ap(a3)
);

// maybe :: b -> (a -> b) -> Maybe a -> b
export const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v;
  }

  return f(m.$value);
});

// nothing :: () -> Maybe a
export const nothing = () => Maybe.of(null);

// reject :: a -> Task a b
export const reject = a => Task.rejected(a);
