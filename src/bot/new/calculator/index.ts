import {
  First as AI
} from './variant';

import Logger from 'js-logger';

import {
  flatMapDeep,
} from 'lodash';

// function timeout(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const calculate = async (args: any, index: number) => {
  
  const [state, other, lastResult, ping] = flatMapDeep(args);
  // console.log("start calculate", state, config, index);
  // await timeout(1000);

  // return `done here ${index}`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // Logger.useDefaults();
  // Logger.setLevel(Logger.TRACE);

  const { config } = other as any;
  const result = await new Promise((resolve) => {
    let ai = new AI(state, config, lastResult, ping);
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
