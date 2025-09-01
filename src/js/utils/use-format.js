

export const useFormat = () => {
  const formatNumber = (value = 0, options) => {
    // Set default options
    options = Object.assign({
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      notation: 'standard', // standard, scientific, engineering, compact
      style: 'decimal' // decimal, currency, percent, unit
    }, options);

    // Initialize number formatter
    const formatter = new Intl.NumberFormat('en-US', options);

    // Return value of formatter
    return formatter.format(value);
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min); // Ensure min is an integer (rounds up)
    max = Math.floor(max); // Ensure max is an integer (rounds down)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const formatDuration = (duration, options) => {
    // Set default duration
    duration = Object.assign({
      hours: 0,
      minutes: 0,
      seconds: 0
    }, duration)

    // Set default options
    options = Object.assign({
      style: 'short' // short, long, narrow, digital
    }, options);

    // Return value of formatter
    const formatter = new Intl.DurationFormat('en', options);
    return formatter.format(duration);
  }

  const formatSeconds = (seconds, options) => {
    return formatDuration({
      seconds: seconds % 60,
      minutes: Math.floor((seconds % 3600) / 60),
      hours: Math.floor(seconds / 3600)
    }, options)
  }

  return {
    formatDuration,
    formatNumber,
    formatSeconds,
    getRandomInt
  }
}