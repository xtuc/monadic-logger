function noLog(fn) {
  return v => logger => {
    return {
      logger,
      value: fn(v),
    }
  }
}

function createComposer(logger) {

  return function compose(...fns) {

    return function apply(inital) {
      let acc = inital;

      fns.forEach(fn => {

        try {
          const res = fn(acc)(logger);

          acc = res.value;
          logger = res.logger;
        } catch (e) {

          logger.push("error: " + e.message);

          return {value: acc, logger};
        }

      })

      return {value: acc, logger};
    }
  };
}

class Logger {

  constructor() {
    this._stack = [];

    this.push = this._stack.push;
    this.map = this._stack.map;
  }
}

String.prototype.describes = function (value) {
  const text = this.slice(0);
  
  return function (logger) {
    logger.push(text);

    return {
      logger,
      value,
    };
  }
}

module.exports = {createComposer, Logger, noLog};
