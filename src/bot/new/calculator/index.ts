import {
  First as AI
} from './variant';

// function timeout(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const calculate = async ([state, other]: any, index: number) => {
  // console.log("start calculate", state, config, index);
  // await timeout(1000);

  // return `done here ${index}`;
  const { config, lastResult } = other;
  const result = await new Promise((resolve) => {
    let ai = new AI(state, config, lastResult)
    // @ts-ignore
    const r = ai.tick();
    // @ts-ignore
    ai = null;

    resolve(r);
    // resolve({});
  });

  // just mock for currenly implement
  // await wait(170);

  return result;
};

export default calculate;
