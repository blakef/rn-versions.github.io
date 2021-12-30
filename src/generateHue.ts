import randomSeed from "random-seed";

export type AvoidToken = {
  adjacentHue: number;
  allHues: number[];
};

const maxLuminanceAgainstWhite = 0.5;
const minLuminanceAgainstBlack = 0.3;

/**
 * Generates a hue with random distribution, stable for a given semver
 * version. Allows passing an `avoidToken` generated by a previous color, to avoid a color similar
 * to it.
 *
 * * Derived from:
 * - http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
 * - https://github.com/devongovett/color-generator
 */
export default function generateHue(
  version: string,
  avoidToken?: AvoidToken
): { hue: number; avoidToken: AvoidToken } {
  const adjacentHueThreshold = 0.25;
  const allHueThreshold = 0.05;

  const goldenRatio = 0.618033988749895;

  const randomGenerator = randomSeed.create(version);
  let hue: number;
  let triesRemaining = 100;

  do {
    hue = randomGenerator.random();
    hue += goldenRatio;
    hue %= 1;
  } while (
    avoidToken &&
    --triesRemaining > 0 &&
    (hueDifference(hue, avoidToken.adjacentHue) < adjacentHueThreshold ||
      avoidToken.allHues.find(
        // eslint-disable-next-line no-loop-func
        (otherHue) => hueDifference(hue, otherHue) < allHueThreshold
      ))
  );

  return {
    hue,
    avoidToken: {
      adjacentHue: hue,
      allHues: [...(avoidToken?.allHues ?? []), hue],
    },
  };
}

/**
 * Calculates a color with the given hue, optionally specified to meet a
 * specific contrast requirement
 */
export function colorForHue(
  hue: number,
  targetLuminance?: "contrasts-white" | "contrasts-black"
) {
  const saturation = 0.8;

  const h = hue * 360;
  const s = saturation;
  const l = getLightness(h, s, targetLuminance);

  return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
}

function hueDifference(hue1: number, hue2: number) {
  return Math.abs(((hue1 - hue2 + 0.5) % 1.0) - 0.5);
}

function getLightness(
  h: number,
  s: number,
  targetLuminance?: "contrasts-white" | "contrasts-black"
) {
  let lightness = 0.65;

  if (targetLuminance === "contrasts-white") {
    while (relativeLuminance(h, s, lightness) > maxLuminanceAgainstWhite) {
      lightness -= 0.02;
    }
  } else if (targetLuminance === "contrasts-black") {
    while (relativeLuminance(h, s, lightness) < minLuminanceAgainstBlack) {
      lightness += 0.02;
    }
  }

  return lightness;
}

/**
 * Calculate the relative luminance which is how bright the color is from the perspective of
 * a human eye.  Blue is much darker than green for instance so (0, 0, 255) is perceived to be
 * significantly darker than (0, 255, 0).  This is used to calculate contrast ratios between
 * two colors to ensure text is readable.
 */
export function relativeLuminance(h: number, s: number, l: number): number {
  const { r, g, b } = hsl2rgb(h, s, l);

  // Formula defined by: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
  // relative luminance: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

  // get the effective radius for each color
  const r1 = standardToLinear(r / 255);
  const g1 = standardToLinear(g / 255);
  const b1 = standardToLinear(b / 255);

  // relative luminance adjusts the R/G/B values by modifiers for their perceived brightness
  // to produce lightness result for how the eye perceives the color
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
}

/**
 * Converts an r, g, or b value in the sRGB color space to the corresponding value in linearRGB
 * This is necessary for relative luminance calculations
 * Formula defined at https://en.wikipedia.org/wiki/SRGB
 *
 * @param c - one of r g or b coming from sRGB
 */
function standardToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hsl2rgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const c: number = (1 - Math.abs(2 * l - 1)) * s;
  const x: number = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m: number = l - c / 2;

  let r1: number = 0;
  let g1: number = 0;
  let b1: number = 0;

  // different values of h
  if (h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round(255 * (r1 + m)),
    g: Math.round(255 * (g1 + m)),
    b: Math.round(255 * (b1 + m)),
  };
}
