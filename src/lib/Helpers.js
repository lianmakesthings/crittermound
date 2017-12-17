const ticksPerSecond = 20;
const SmartRound = (value) => {
  return value < 100 ? Math.round(value * 10) / 10 : Math.round(value);
};
const CoinFlip = () => {
  return Math.random() < .5 ? true : false;
};

export {
  ticksPerSecond,
  SmartRound,
  CoinFlip
}
