/**
 * Seedable PRNG & Fast 2D/3D Simplex & Perlin Noise Engine
 * Built for generative vector art & deterministic reproducibility.
 */

class MathUtils {
  // Hash a string into a 32-bit integer seed
  static hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Linear interpolation
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Map value from one range to another with optional clamp
  static map(value, inMin, inMax, outMin, outMax, clamp = false) {
    let out = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    if (clamp) {
      const min = Math.min(outMin, outMax);
      const max = Math.max(outMin, outMax);
      out = Math.max(min, Math.min(max, out));
    }
    return out;
  }

  static clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  static dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  static radians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  static degrees(radians) {
    return (radians * 180) / Math.PI;
  }
}

// Deterministic fast PRNG (Mulberry32)
class RandomGenerator {
  constructor(seed = 1337) {
    this.setSeed(seed);
  }

  setSeed(seed) {
    if (typeof seed === 'string') {
      this.seed = MathUtils.hashString(seed);
    } else {
      this.seed = Math.floor(Math.abs(seed)) || 1337;
    }
    this.state = this.seed;
  }

  // Returns float in [0, 1)
  next() {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Range [min, max)
  range(min, max) {
    return min + this.next() * (max - min);
  }

  // Random integer [min, max]
  rangeInt(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  // Random boolean with chance probability
  chance(prob = 0.5) {
    return this.next() < prob;
  }

  // Gaussian / Normal distribution random number (Box-Muller)
  gaussian(mean = 0, stdev = 1) {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 === 0) u1 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdev + mean;
  }

  // Pick random element from array
  pick(array) {
    if (!array || array.length === 0) return null;
    return array[this.rangeInt(0, array.length - 1)];
  }
}

// 2D Simplex Noise Implementation (Deterministic & Seedable)
class SimplexNoise {
  constructor(randomInstance = new RandomGenerator(42)) {
    this.reseed(randomInstance);
  }

  reseed(randomInstance) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      this.p[i] = i;
    }

    // Shuffle using Fisher-Yates with our seedable PRNG
    for (let i = 255; i > 0; i--) {
      const j = randomInstance.rangeInt(0, i);
      const tmp = this.p[i];
      this.p[i] = this.p[j];
      this.p[j] = tmp;
    }

    // Duplicate permutation array to avoid modulo
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  // 2D Simplex Noise in range [-1, 1]
  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    let n0 = 0, n1 = 0, n2 = 0;

    // Skew the input space to determine which simplex cell we're in
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t; // Unskew the cell origin back to (x,y) space
    const Y0 = j - t;
    const x0 = xin - X0; // The x,y distances from the cell origin
    const y0 = yin - Y0;

    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where c = (3-sqrt(3))/6
    const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    const y2 = y0 - 1.0 + 2.0 * G2;

    // Work out the hashed gradient indices of the three simplex corners
    const ii = i & 255;
    const jj = j & 255;

    // Calculate contribution from three corners
    const grad3 = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1]
    ];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      t0 *= t0;
      const gi0 = this.permMod12[ii + this.perm[jj]];
      n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      t1 *= t1;
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
      n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      t2 *= t2;
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];
      n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
    }

    // Add contributions from each corner to get the final noise value.
    // Result is scaled to return values in the interval [-1, 1].
    return 70.0 * (n0 + n1 + n2);
  }

  // Fractal Brownian Motion (octaves, persistence, lacunarity)
  fBm(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0; // Used for normalizing result

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  // Curl noise for ultra-smooth fluid flow fields
  curl(x, y, eps = 0.001) {
    const n1 = this.noise2D(x, y + eps);
    const n2 = this.noise2D(x, y - eps);
    const n3 = this.noise2D(x + eps, y);
    const n4 = this.noise2D(x - eps, y);

    const dx = (n1 - n2) / (2 * eps);
    const dy = (n3 - n4) / (2 * eps);

    return { x: dy, y: -dx, angle: Math.atan2(-dx, dy) };
  }
}

// Global instances for convenience
window.MathUtils = MathUtils;
window.RandomGenerator = RandomGenerator;
window.SimplexNoise = SimplexNoise;
