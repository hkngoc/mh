import throttle from './throttle';

const newChildObject = function(parentObj, newObj) {
  // equivalent to: var resultObj = { __proto__: parentObj };
  const x = function() {};
  x.prototype = parentObj;
  const resultObj = new x();

  // store new members in resultObj
  if (newObj) {
    const hasProp = {}.hasOwnProperty;
    for (const name in newObj) {
      if (hasProp.call(newObj, name)) {
        resultObj[name] = newObj[name];
      }
    }
  }

  return resultObj;
};


export {
  throttle,
  newChildObject
}
