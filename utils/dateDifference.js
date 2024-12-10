module.exports = function getDaysDifference(startDate, endDate = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end.getTime() - start.getTime();
  return timeDifference / (1000 * 3600 * 24);
};
