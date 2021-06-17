# HashId

HashId is a library that generates short, unique, non-sequential ids from numbers.

based on [hashids](https://hashids.org/)

## Getting Started

`npm i hash-id --save`

## Example

```typescript
import { HashId } from "@ay/hash-id";
const hashId = new HashId({
  salt: "a17b3c3e73ad70620e87b7170f6857c7",
  minHashLength: 6,
  prefix: "PREFIX_",
  suffix: "_SUFFIX",
});

console.log(hashId.encode(10353)); // PREFIX_GJWMQ5_SUFFIX
console.log(hashId.decode("PREFIX_GJWMQ5_SUFFIX")); // 10353
```

```typescript
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

// default alphabet: ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```
