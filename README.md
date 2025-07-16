# HashId

HashId is a library that generates short, unique, non-sequential ids from numbers.

based on [sqids / hashids](https://sqids.org/)

## Getting Started

[GitHub](https://github.com/EJayCheng/hash-id) / [npm](https://www.npmjs.com/package/id-hasher)

`npm i id-hasher --save`

```typescript
import { IdHasher } from 'id-hasher';
const idHasher = new IdHasher({
  minLength: 6,
  prefix: 'PREFIX_',
  suffix: '_SUFFIX',
  alphabet: {
    uppercaseLetters: true,
    numbers: true,
    salt: 'a17b3c3e73ad70620e87b7170f6857c7',
  },
});

console.log(idHasher.encode(10353)); // PREFIX_GJWMQ5_SUFFIX
console.log(idHasher.decode('PREFIX_GJWMQ5_SUFFIX')); // 10353
```

## Interface

```typescript
export interface IdHasherConfig {
  /** Prefix of hashify */
  prefix?: string;
  /** Suffix of hashify  */
  suffix?: string;
  /** Min length of hashify, Default: 6 */
  minLength?: number;
  /** Allow alphabet of hashify, Default: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 */
  alphabet?: string | AlphabetFactoryConfig;
  /** Prevent specific words from appearing anywhere in the auto-generated IDs */
  blocklist?: Set<string>;
}

/** Default Alphabet */
export const RECOGNIZABLE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Alphabet Factory Config */
export interface AlphabetFactoryConfig {
  /** Include uppercase letters in the alphabet. ABCDEFGHJKLMNPQRSTUVWXYZ */
  uppercaseLetters?: boolean;
  /** Include lowercase letters in the alphabet. abcdefghijkmnpqrstuvwxyz */
  lowercaseLetters?: boolean;
  /** Include numbers in the alphabet. 0123456789 */
  numbers?: boolean;
  /** Include symbols in the alphabet. !@#$%^&*()_+-=[]{}|;:,.<>?/~` */
  symbols?: boolean;
  /** Custom characters to include in the alphabet */
  customCharacters?: string;
  /** Hash salt */
  salt?: string;
}
```
