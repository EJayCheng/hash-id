import Sqids from 'sqids';
export interface IdHasherConfig {
  alphabet?: AlphabetFactoryConfig | string;
  minLength?: number;
  blocklist?: Set<string>;
  prefix?: string;
  suffix?: string;
}

export const RECOGNIZABLE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export interface AlphabetFactoryConfig {
  uppercaseLetters?: boolean;
  lowercaseLetters?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  customCharacters?: string;
  salt?: string;
}
export class AlphabetFactory {
  public static createAlphabet(config: AlphabetFactoryConfig | string): string {
    if (typeof config === 'string') {
      return AlphabetFactory.removeDuplicateCharacters(config);
    }
    let alphabet = '';
    if (typeof config.customCharacters == 'string') {
      alphabet += config.customCharacters;
    }
    if (config.uppercaseLetters) {
      alphabet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (config.lowercaseLetters) {
      alphabet += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (config.symbols) {
      alphabet += '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    }
    if (config.numbers) {
      alphabet += '0123456789';
    }
    return AlphabetFactory.shuffleAlphabet(
      AlphabetFactory.removeDuplicateCharacters(alphabet),
      config.salt,
    );
  }

  public static removeDuplicateCharacters(alphabet: string): string {
    return Array.from(new Set(alphabet)).join('');
  }

  private static hash(salt: string, index: number): number {
    let hash = 0;
    const saltedInput = salt + index.toString();
    for (let i = 0; i < saltedInput.length; i++) {
      hash = (hash << 5) - hash + saltedInput.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 0xffffffff;
  }

  public static shuffleAlphabet(alphabet: string, salt: string): string {
    if (!salt || !alphabet) {
      return alphabet;
    }
    const arr = alphabet.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const randIdx = Math.floor(AlphabetFactory.hash(salt, i) * (i + 1));
      [arr[i], arr[randIdx]] = [arr[randIdx], arr[i]];
    }
    return arr.join('');
  }
}

export class IdHasher {
  private sqids: Sqids;
  public constructor(private config: IdHasherConfig = {}) {
    if (typeof this.config != 'object') {
      throw new Error(`config must be object`);
    }
    const defaultConfig: IdHasherConfig = {
      minLength: 6,
      alphabet: RECOGNIZABLE_ALPHABET,
      prefix: '',
      suffix: '',
    };

    this.config = Object.assign(defaultConfig, this.config);

    if (
      this.config.minLength &&
      !this.isPositiveInteger(this.config.minLength)
    ) {
      throw new Error(
        `config.minLength(${this.config.minLength}) must be positive integer`,
      );
    }
    const alphabet = AlphabetFactory.createAlphabet(this.config.alphabet);

    this.sqids = new Sqids({
      alphabet,
      minLength: this.config.minLength,
      blocklist: this.config.blocklist,
    });
  }

  private get prefix(): string {
    return typeof this.config.prefix == 'string' ? this.config.prefix : '';
  }

  private get suffix(): string {
    return typeof this.config.suffix == 'string' ? this.config.suffix : '';
  }

  private removeFixString(input: string): string {
    input = input.trim();
    if (this.prefix) {
      input = input.replace(new RegExp(`^${this.prefix}`, 'i'), '');
    }
    if (this.suffix) {
      input = input.replace(new RegExp(`${this.suffix}$`, 'i'), '');
    }
    return input;
  }

  private isPositiveInteger(id: any): boolean {
    if (
      typeof id != 'number' ||
      isNaN(id) ||
      id === Infinity ||
      id < 0 ||
      id % 1 !== 0
    ) {
      return false;
    }
    return true;
  }

  public encodes(ids: number[]): string {
    if (!ids || !Array.isArray(ids) || ids.length == 0) {
      throw new Error(`ids must be non-empty array`);
    }
    for (const id of ids) {
      if (!this.isPositiveInteger(id)) {
        throw new Error(`id(${id}) must be positive integer`);
      }
    }
    const code = this.sqids.encode(ids);
    return this.prefix + code + this.suffix;
  }

  public encode(id: number): string {
    return this.encodes([id]);
  }

  public decodes(code: string): number[] {
    if (typeof code != 'string' || !code) {
      throw new Error(`code must be non-empty string`);
    }
    code = this.removeFixString(code);
    if (code.length < this.config.minLength) {
      throw new Error(
        `code must be at least ${this.config.minLength} characters`,
      );
    }
    const results = this.sqids.decode(code);
    if (!results.length) {
      throw new Error(`code(${code}) is not valid`);
    }
    return results;
  }

  public decode(code: string): number {
    return this.decodes(code)[0];
  }
}
