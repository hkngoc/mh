
function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const calculate = async ([state, config]: any, index: number) => {
  console.log("start calculate", state, config, index);
  await timeout(1000);

  return `done here ${index}`;
};

export default calculate;
