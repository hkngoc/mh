const throttle = (func, callback) => {
  let lastArgs, lastThis, lastCallTime, result, invoking;

  const invokeFunc = async () => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;

    // lock
    invoking = true;
    result = await func.apply(thisArg, args);
    invoking = false;

    if (callback && typeof(callback) == 'function') {
      callback(result);
    }
    // unlock

    return result;
  }

  const shouldInvoke = (time) => {
    return !invoking;
  }

  const flush = () => {
    // invoke with last args
  }

  const pending = () => {
    return invoking;
  }

  const throttled = (...args) => {
    lastArgs = args;
    lastThis = this;

    const time = Date.now();
    lastCallTime = time;

    const flag = shouldInvoke(time);

    if (flag) {
      return invokeFunc(lastCallTime);
    } else {
      return undefined;
    }
  }

  return throttled;
};

export default throttle;
