export const closeToMatcher = (expected: number, precision = 10) => ({
  asymmetricMatch: (actual) =>
    Math.abs(expected - actual) < Math.pow(10, -precision) / 2,
});
