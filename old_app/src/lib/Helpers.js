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
const Shuffle = (array) => {
  let r;
  let i;
  for(let t = array.length -1; t >= 0; t--) {
    i = Math.floor(Math.random()*t);
    r = array[t];
    array[t] = array[i];
    array[i] = r;
  }
  return array
};

export {
  ticksPerSecond,
  SmartRound,
  CoinFlip,
  StatVariance,
  RandomInRange,
  Shuffle
}
