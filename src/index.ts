import Hashids from "hashids";
import { extend } from "lodash";
export interface HashIdConfig {
  /** hash 時使用的 salt */
  salt: string;
  /** hash 後的 id 前綴 */
  prefix?: string;
  /** hash 後的 id 後綴 */
  suffix?: string;
  /** hash 後的 id 最小長度 */
  minHashLength?: number;
  /** 允許的字符 */
  alphabet?: string;
}

export const RECOGNIZABLE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export class HashId {
  private _hashId: Hashids;
  public constructor(private _config: HashIdConfig) {
    if (
      !this._config ||
      !this._config.salt ||
      typeof this._config.salt != "string"
    ) {
      throw "salt must be a string and not empty";
    }

    this._config = extend<HashIdConfig>(
      {
        minHashLength: 6,
        alphabet: RECOGNIZABLE_ALPHABET,
        prefix: "",
        suffix: "",
      },
      this._config
    );

    this._hashId = new Hashids(
      this._config.salt,
      this._config.minHashLength,
      this._config.alphabet
    );
  }

  private get _prefix(): string {
    return typeof this._config.prefix == "string" ? this._config.prefix : "";
  }

  private get _suffix(): string {
    return typeof this._config.suffix == "string" ? this._config.suffix : "";
  }

  private _removeFixString(input: string): string {
    if (this._prefix) {
      input = input.replace(new RegExp(`^${this._prefix}`, "i"), "");
    }
    if (this._suffix) {
      input = input.replace(new RegExp(`${this._suffix}$`, "i"), "");
    }
    return input;
  }

  public encode(id: number): string {
    if (
      typeof id != "number" ||
      isNaN(id) ||
      id === Infinity ||
      id < 0 ||
      id % 1 !== 0
    ) {
      throw "id must be positive integer";
    }
    let code = this._hashId.encode(id);
    return this._prefix + code + this._suffix;
  }

  public decode(code: string): number {
    if (typeof code != "string" || code.length == 0) {
      return;
    }
    let value = this._removeFixString(code.trim());
    if (value.length < this._config.minHashLength) {
      return;
    }
    return this._hashId.decode(value)[0];
  }
}
