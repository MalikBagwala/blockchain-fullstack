import cryptoHash from "./hash.utils";

describe("Crypto Hash", () => {
  it("Returns Proper hash for `foo`", () => {
    expect(cryptoHash("foo")).toEqual(
      "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
    );
  });
  it("Returns same hash irrespective of order", () => {
    expect(cryptoHash("foo", "bar")).toEqual(cryptoHash("bar", "foo"));
  });
});
