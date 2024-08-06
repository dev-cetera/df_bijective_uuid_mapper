//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// Dart/Flutter (DF) Packages by DevCetra.com & contributors. See LICENSE file
// in root directory.
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import * as crypto from 'crypto';

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

// Maps source to a unique string using a bijective transformation
export function bijectiveStringTransformationV1({
  source,
  digest,
  charList,
}: {
  source: string;
  digest: string;
  charList: string;
}): string {
  const k = removeDashesFromString(source);
  const indexes = stringToIndexes(k, charList);
  const max = charList.length - 1;
  const mappedIndexes = indexes.map((i) =>
    bijectiveTransformationV1(i, max, digest)
  );
  const result = indexesToString(mappedIndexes, charList);
  const resultWithDashes = addDashesToString(result, [8, 12, 16, 20]);
  return resultWithDashes;
}

// Unmaps source that was previously mapped using bijectiveStringTransformationV1
export function reverseBijectiveStringTransformationV1({
  source,
  digest,
  charList,
}: {
  source: string;
  digest: string;
  charList: string;
}): string {
  const k = removeDashesFromString(source);
  const indexes = stringToIndexes(k, charList);
  const max = charList.length - 1;
  const mappedIndexes = indexes.map((i) =>
    reverseBijectiveTransformationV1(i, max, digest)
  );
  const result = indexesToString(mappedIndexes, charList);
  const resultWithDashes = addDashesToString(result, [8, 12, 16, 20]);
  return resultWithDashes;
}

// Converts string to a list of indices based on charList
function stringToIndexes(input: string, charList: string): number[] {
  return input.split('').map((c) => {
    const index = charList.indexOf(c);
    if (index === -1) {
      throw new Error(`Invalid character: ${c}`);
    }
    return index;
  });
}

// Converts a list of indices back to a string using charList
function indexesToString(indexes: number[], charList: string): string {
  return String.fromCharCode(
      ...indexes.map((i) => {
        if (i < 0 || i >= charList.length) {
          throw new Error(`Invalid index: ${i}`);
        }
        return charList.charCodeAt(i);
      })
  );
}

// Adds dashes to the given source string at the given positions
function addDashesToString(source: string, positions: number[]): string {
  positions.sort((a, b) => b - a);
  for (const position of positions) {
    if (position < source.length) {
      source = `${source.substring(0, position)}-${source.substring(position)}`;
    }
  }
  return source;
}

// Removes dashes from the given source string
function removeDashesFromString(source: string): string {
  return source.replace(/-/g, '');
}

// Maps x to a unique number using a bijective transformation
function bijectiveTransformationV1(x: number, max: number, digest: string): number {
  const a = generateAFromDigest(digest, max, 0);
  const b = generateBFromDigest(digest, max, 8);
  return bijectiveTransformation(x, max, a, b);
}

function bijectiveTransformation(x: number, max: number, a: number, b: number): number {
  return (a * x + b) % (max + 1);
}

// Unmaps y that was previously mapped using bijectiveTransformationV1
function reverseBijectiveTransformationV1(y: number, max: number, digest: string): number {
  const a = generateAFromDigest(digest, max, 0);
  const b = generateBFromDigest(digest, max, 8);
  return reverseBijectiveTransformation(y, max, a, b);
}

function reverseBijectiveTransformation(y: number, max: number, a: number, b: number): number {
  const aInverse = modularInverse(a, max + 1);
  let n = (aInverse * (y - b)) % (max + 1);
  if (n < 0) n += (max + 1);
  return n;
}

// Finds the modular inverse of the given number a with the given modulus
function modularInverse(a: number, modulus: number): number {
  const m0 = modulus;
  let x0 = 0;
  let x1 = 1;
  while (a > 1) {
    const q = Math.floor(a / modulus);
    let t = modulus;
    modulus = a % modulus;
    a = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }
  if (x1 < 0) x1 += m0;
  return x1;
}

// Generates a valid value for 'a' from the given digest
function generateAFromDigest(digest: string, max: number, offset: number): number {
  const modulus = max + 1;
  let a = generateInt32FromDigest(digest, offset) % modulus;
  while (a <= 1 || gcd(a, modulus) !== 1) {
    a = (a + 1) % modulus;
  }
  return a;
}

// Returns the greatest common divisor of two numbers a and b
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Generates a valid value for 'b' from the given digest
function generateBFromDigest(digest: string, max: number, offset: number): number {
  return generateInt32FromDigest(digest, offset) % (max + 1);
}

// Generates a 32-bit integer from the given digest at the given offset
function generateInt32FromDigest(digest: string, offset: number): number {
  const source = wrappableSubstring(digest, offset, 8);
  return parseInt(source, 16);
}

// Returns a substring of the given source string starting at the given start index
// and wrapping around to the beginning of the string if necessary
function wrappableSubstring(source: string, start: number, length: number): string {
  start = start % source.length;
  if (start < 0) start += source.length;
  let substring = '';
  for (let i = 0; i < length; i++) {
    const currentIndex = (start + i) % source.length;
    substring += source[currentIndex];
  }
  return substring;
}

// Generates a SHA256 digest from the given password
export function generateDigestFromSeed(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
