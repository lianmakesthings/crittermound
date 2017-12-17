const SmartRound = (value) => {
  return value < 100 ? Math.round(value * 10) / 10 : Math.round(value);
};

export {
  SmartRound
}
