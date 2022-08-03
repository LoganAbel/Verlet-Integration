const length = (x, y) => Math.sqrt(x * x + y * y)

const lerp = (a, b, x) => a + x * (b - a)

const in_range = (x, a, b) => a < x && x < b
const clamp = (x, a, b) => x < a ? a : x > b ? b : x