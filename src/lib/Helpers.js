const ticksPerSecond = 20;
const SmartRound = (value) => {
  return value < 100 ? Math.round(value * 10) / 10 : Math.round(value);
};
const CoinFlip = () => {
  return Math.random() < .5 ? true : false;
};
const StatVariance = (value) => {
  return value<1e3 ? Math.floor(value/50)+1 : 20
};
const RandomInRange = (min , max) => {
  return Math.floor(Math.random()*(max-min+1))+min
};

export {
  ticksPerSecond,
  SmartRound,
  CoinFlip,
  StatVariance,
  RandomInRange
}
