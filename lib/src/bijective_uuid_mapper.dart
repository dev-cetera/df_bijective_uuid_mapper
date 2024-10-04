//.title
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//
// Dart/Flutter (DF) Packages by DevCetra.com & contributors. The use of this
// source code is governed by an MIT-style license described in the LICENSE
// file located in this project's root directory.
//
// See: https://opensource.org/license/mit
//
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//.title~

import 'base_char_lists.dart' show BASE_16_CHAR_LIST_A;
import '_utils.dart' as utils;

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

class BijectiveUuidMapper {
  //
  //
  //

  final String seed;
  final String charList;

  //
  //
  //

  BijectiveUuidMapper({
    required this.seed,
    this.charList = BASE_16_CHAR_LIST_A,
  });

  //
  //
  //

  late final digest = utils.generateDigestFromSeed(seed);

  //
  //
  //

  String map(String uuid) {
    return utils.bijectiveStringTransformationV1(
      source: uuid,
      digest: digest,
      charList: charList,
    );
  }

  //
  //
  //

  String unmap(String uuid) {
    return utils.reverseBijectiveStringTransformationV1(
      source: uuid,
      digest: digest,
      charList: charList,
    );
  }
}
