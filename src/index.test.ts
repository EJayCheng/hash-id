import { HashId } from "./";
import { rejects } from "assert";

describe("HashId base", () => {
  const hashId = new HashId({
    salt: "a17b3c3e73ad70620e87b7170f6857c7",
    minHashLength: 6
  });

  describe("encode", () => {
    test("encode id is 0", () => {
      expect(hashId.encode(0)).toBe("P5Z9GY");
    });

    test("encode id is 1", () => {
      expect(hashId.encode(1)).toBe("45WRGM");
    });

    test("encode id is 1000000000", () => {
      expect(hashId.encode(1000000000)).toBe("Z6K9K7LM");
    });

    test("encode id is string", done => {
      try {
        hashId.encode("3" as any);
      } catch (err) {
        expect(err).toBe("id must be positive integer");
        done();
        return;
      }
      done.fail("encode error is not match");
    });

    test("encode id is not integer", done => {
      try {
        hashId.encode(3.14);
      } catch (err) {
        expect(err).toBe("id must be positive integer");
        done();
        return;
      }
      done.fail("encode error is not match");
    });

    test("encode id is Infinity", done => {
      try {
        hashId.encode(Infinity);
      } catch (err) {
        expect(err).toBe("id must be positive integer");
        done();
        return;
      }
      done.fail("encode error is not match");
    });

    test("encode id is NaN", done => {
      try {
        hashId.encode(NaN);
      } catch (err) {
        expect(err).toBe("id must be positive integer");
        done();
        return;
      }
      done.fail("encode error is not match");
    });

    test("encode id is negative number", done => {
      try {
        hashId.encode(-111);
      } catch (err) {
        expect(err).toBe("id must be positive integer");
        done();
        return;
      }
      done.fail("encode error is not match");
    });
  });

  describe("decode", () => {
    test("decode 45WRGM to 1", () => {
      expect(hashId.decode("45WRGM")).toBe(1);
    });

    test("decode Z6K9K7LM to 1000000000", () => {
      expect(hashId.decode("Z6K9K7LM")).toBe(1000000000);
    });

    test("decode empty string", () => {
      expect(hashId.decode("")).toBeUndefined();
    });

    test("decode error string", () => {
      expect(hashId.decode("123")).toBeUndefined();
    });

    test("decode not string", () => {
      expect(hashId.decode(1 as any)).toBeUndefined();
    });
  });
});

describe("HashId minHashLength", () => {
  test("minHashLength 8", () => {
    let hashId = new HashId({
      salt: "25425af6c498af970db73067e0ca3779",
      minHashLength: 8
    });
    expect(hashId.encode(1)).toBe("WZLDPL7Q");
    expect(hashId.encode(2)).toBe("QP5XD5XD");
    expect(hashId.encode(3)).toBe("JQL8JLZP");
    expect(hashId.decode("WZLDPL7Q")).toBe(1);
    expect(hashId.decode("QP5XD5XD")).toBe(2);
    expect(hashId.decode("JQL8JLZP")).toBe(3);
  });

  test("minHashLength 3", () => {
    let hashId = new HashId({
      salt: "166e9260d2dff217787dc54336da9490",
      minHashLength: 3
    });
    expect(hashId.encode(1)).toBe("46M");
    expect(hashId.encode(2)).toBe("45W");
    expect(hashId.encode(3)).toBe("4N2");
    expect(hashId.decode("46M")).toBe(1);
    expect(hashId.decode("45W")).toBe(2);
    expect(hashId.decode("4N2")).toBe(3);
  });
});

describe("HashId fix string", () => {
  test("HashId prefix", () => {
    let hashId = new HashId({
      salt: "aadce520e20c2899f4ced228a79a3083",
      prefix: "WTF_"
    });
    expect(hashId.encode(1)).toBe("WTF_JG8K2K");
    expect(hashId.encode(2)).toBe("WTF_EGY9G8");
    expect(hashId.encode(3)).toBe("WTF_E27E2N");
    expect(hashId.decode("WTF_JG8K2K")).toBe(1);
    expect(hashId.decode("WTF_EGY9G8")).toBe(2);
    expect(hashId.decode("WTF_E27E2N")).toBe(3);
  });

  test("HashId suffix", () => {
    let hashId = new HashId({
      salt: "8e9d6cb8e2981fae79794b77cb7c67dd",
      suffix: "_WTF"
    });
    expect(hashId.encode(1)).toBe("87R47D_WTF");
    expect(hashId.encode(2)).toBe("6VNRVL_WTF");
    expect(hashId.encode(3)).toBe("EV5P73_WTF");
    expect(hashId.decode("87R47D_WTF")).toBe(1);
    expect(hashId.decode("6VNRVL_WTF")).toBe(2);
    expect(hashId.decode("EV5P73_WTF")).toBe(3);
  });

  test("HashId prefix and suffix", () => {
    let hashId = new HashId({
      salt: "58f3b9f6257ecab786899ff9fb437b31",
      prefix: "WTF_",
      suffix: "_COOL"
    });
    expect(hashId.encode(1)).toBe("WTF_WQG7QD_COOL");
    expect(hashId.encode(2)).toBe("WTF_693793_COOL");
    expect(hashId.encode(3)).toBe("WTF_ZQER9X_COOL");
    expect(hashId.decode("WTF_WQG7QD_COOL")).toBe(1);
    expect(hashId.decode("WTF_693793_COOL")).toBe(2);
    expect(hashId.decode("WTF_ZQER9X_COOL")).toBe(3);
  });

  test("HashId error prefix and suffix", () => {
    let hashId = new HashId({
      salt: "359290388d5290f1296c1cc503442407",
      prefix: 123 as any,
      suffix: 456 as any
    });
    expect(hashId.encode(1)).toBe("MW7P4X");
    expect(hashId.encode(2)).toBe("LWDM4E");
    expect(hashId.encode(3)).toBe("KWEP4R");
    expect(hashId.decode("MW7P4X")).toBe(1);
    expect(hashId.decode("LWDM4E")).toBe(2);
    expect(hashId.decode("KWEP4R")).toBe(3);
  });
});

describe("HashId error catch", () => {
  test("salt not a string", done => {
    try {
      new HashId({} as any);
    } catch (err) {
      expect(err).toBe("salt must be a string and not empty");
      done();
      return;
    }
    done.fail("salt error is not match");
  });
  test("salt is a empty string", done => {
    try {
      new HashId({ salt: "" });
    } catch (err) {
      expect(err).toBe("salt must be a string and not empty");
      done();
      return;
    }
    done.fail("salt error is not match");
  });
});
