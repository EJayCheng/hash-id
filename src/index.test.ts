import { IdHasher, RECOGNIZABLE_ALPHABET } from './';

describe('HashId base', () => {
  const hashId = new IdHasher({
    minLength: 6,
    alphabet: RECOGNIZABLE_ALPHABET,
  });

  describe('encode', () => {
    test('encode id is 0', () => {
      expect(hashId.encode(0)).toBe('7TLB24');
    });

    test('encode id is 1', () => {
      expect(hashId.encode(1)).toBe('T5KT5H');
    });

    test('encode id is 1000000000', () => {
      expect(hashId.encode(1000000000)).toBe('7K56WMBQ');
    });

    test('encode id is string', (done) => {
      try {
        hashId.encode('3' as any);
      } catch (err) {
        expect(err.toString()).toBe('Error: id(3) must be positive integer');
        done();
        return;
      }
      done.fail('encode error is not match');
    });

    test('encode id is not integer', (done) => {
      try {
        hashId.encode(3.14);
      } catch (err) {
        expect(err.toString()).toBe('Error: id(3.14) must be positive integer');
        done();
        return;
      }
      done.fail('encode error is not match');
    });

    test('encode id is Infinity', (done) => {
      try {
        hashId.encode(Infinity);
      } catch (err) {
        expect(err.toString()).toBe(
          'Error: id(Infinity) must be positive integer',
        );
        done();
        return;
      }
      done.fail('encode error is not match');
    });

    test('encode id is NaN', (done) => {
      try {
        hashId.encode(NaN);
      } catch (err) {
        expect(err.toString()).toBe('Error: id(NaN) must be positive integer');
        done();
        return;
      }
      done.fail('encode error is not match');
    });

    test('encode id is negative number', (done) => {
      try {
        hashId.encode(-111);
      } catch (err) {
        expect(err.toString()).toBe('Error: id(-111) must be positive integer');
        done();
        return;
      }
      done.fail('encode error is not match');
    });
  });

  describe('decode', () => {
    test('decode 45WRGM to 13051202', () => {
      expect(hashId.decode('45WRGM')).toBe(13051202);
    });

    test('decode Z6K9K7LM to 4750896923', () => {
      expect(hashId.decode('Z6K9K7LM')).toBe(4750896923);
    });

    test('decode empty string', (done) => {
      try {
        hashId.decode('');
      } catch (err) {
        expect(err.toString()).toBe('Error: code must be non-empty string');
        done();
        return;
      }
    });

    test('decode error string', (done) => {
      try {
        expect(hashId.decode('123123')).toBeUndefined();
      } catch (err) {
        expect(err.toString()).toBe('Error: code(123123) is not valid');
        done();
        return;
      }
    });

    test('decode not string', (done) => {
      try {
        hashId.decode(1 as any);
      } catch (err) {
        expect(err.toString()).toBe('Error: code must be non-empty string');
        done();
        return;
      }
    });
  });
});

describe('HashId minHashLength', () => {
  test('minHashLength 8', () => {
    let hashId = new IdHasher({
      minLength: 8,
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('T5KT5H8Q');
    expect(hashId.encode(2)).toBe('X35QBE5P');
    expect(hashId.encode(3)).toBe('K3X5YV7F');
    expect(hashId.decode('T5KT5H8Q')).toBe(1);
    expect(hashId.decode('X35QBE5P')).toBe(2);
    expect(hashId.decode('K3X5YV7F')).toBe(3);
  });

  test('minHashLength 3', () => {
    let hashId = new IdHasher({
      minLength: 3,
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('T5K');
    expect(hashId.encode(2)).toBe('X35');
    expect(hashId.encode(3)).toBe('K3X');
    expect(hashId.decode('T5K')).toBe(1);
    expect(hashId.decode('X35')).toBe(2);
    expect(hashId.decode('K3X')).toBe(3);
  });
});

describe('HashId fix string', () => {
  test('HashId prefix', () => {
    let hashId = new IdHasher({
      prefix: 'WTF_',
      minLength: 4,
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('WTF_T5KT');
    expect(hashId.encode(2)).toBe('WTF_X35Q');
    expect(hashId.encode(3)).toBe('WTF_K3X5');
    expect(hashId.decode('WTF_T5KT')).toBe(1);
    expect(hashId.decode('WTF_X35Q')).toBe(2);
    expect(hashId.decode('WTF_K3X5')).toBe(3);
  });

  test('HashId suffix', () => {
    let hashId = new IdHasher({
      suffix: '_WTF',
      minLength: 4,
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('T5KT_WTF');
    expect(hashId.encode(2)).toBe('X35Q_WTF');
    expect(hashId.encode(3)).toBe('K3X5_WTF');
    expect(hashId.decode('T5KT_WTF')).toBe(1);
    expect(hashId.decode('X35Q_WTF')).toBe(2);
    expect(hashId.decode('K3X5_WTF')).toBe(3);
  });

  test('HashId prefix and suffix', () => {
    let hashId = new IdHasher({
      prefix: 'WTF_',
      minLength: 4,
      suffix: '_COOL',
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('WTF_T5KT_COOL');
    expect(hashId.encode(2)).toBe('WTF_X35Q_COOL');
    expect(hashId.encode(3)).toBe('WTF_K3X5_COOL');
    expect(hashId.decode('WTF_T5KT_COOL')).toBe(1);
    expect(hashId.decode('WTF_X35Q_COOL')).toBe(2);
    expect(hashId.decode('WTF_K3X5_COOL')).toBe(3);
  });

  test('HashId error prefix and suffix', () => {
    let hashId = new IdHasher({
      minLength: 4,
      prefix: 123 as any,
      suffix: 456 as any,
      alphabet: RECOGNIZABLE_ALPHABET,
    });
    expect(hashId.encode(1)).toBe('T5KT');
    expect(hashId.encode(2)).toBe('X35Q');
    expect(hashId.encode(3)).toBe('K3X5');
    expect(hashId.decode('T5KT')).toBe(1);
    expect(hashId.decode('X35Q')).toBe(2);
    expect(hashId.decode('K3X5')).toBe(3);
  });
});
