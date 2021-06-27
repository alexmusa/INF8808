export function compare (time1, time2) {
  if (time1.period > time2.period) {
    return 1
  }
  if (time1.period < time2.period) {
    return -1
  }

  if (time1.period === time2.period) {
    if (time1.quarter > time2.quarter) {
      return 1
    }
    if (time1.quarter < time2.quarter) {
      return -1
    }
  }

  return 0
}