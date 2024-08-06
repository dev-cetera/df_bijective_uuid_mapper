//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// Dart/Flutter (DF) Packages by DevCetra.com & contributors. See LICENSE file
// in root directory.
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import {BASE_16_CHAR_LIST_A} from './base_char_lists';
import {
  generateDigestFromSeed,
  bijectiveStringTransformationV1,
  reverseBijectiveStringTransformationV1,
} from './utils';

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

export class BijectiveUuidMapper {
  //
  //
  //

  private charList: string;
  private digest: string;

  //
  //
  //

  constructor({
    seed,
    charList = BASE_16_CHAR_LIST_A,
  }: {
    seed: string;
    charList?: string;
  }) {
    this.charList = charList;
    this.digest = generateDigestFromSeed(seed);
  }

  //
  //
  //

  map(uuid: string): string {
    return bijectiveStringTransformationV1({
      source: uuid,
      digest: this.digest,
      charList: this.charList,
    });
  }

  //
  //
  //

  unmap(uuid: string): string {
    return reverseBijectiveStringTransformationV1({
      source: uuid,
      digest: this.digest,
      charList: this.charList,
    });
  }
}
