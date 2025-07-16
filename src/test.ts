import { IdHasher } from './index';
const hasher = new IdHasher({
  minLength: 4,
  prefix: 'WTF_',
  suffix: '_COOL',
  alphabet: {
    // symbols: true,
    numbers: true,
    uppercaseLetters: true,
    lowercaseLetters: true,
    salt: 'salt',
  },
});
for (let i = 0; i <= 1000; i++) {
  const code = hasher.encode(i);
  console.log([i, code, hasher.decode(code)].join(' | '));
}
