const Tap = require("tap");
const { extractFromObj } = require("../lib/utils");

Tap.test("extractFromObj should extract all types", test => {
  const sym1 = Symbol("abcdefg");
  const sym2 = Symbol("abcdefgdefgasdf");

  const output = extractFromObj(
    {
      hello: "world",
      test: { foo: "bar", home: "here" },
      blah: 50,
      oops: null,
      oops2: undefined,
      oops3: false,
      sym1,
      sym2,
      boo1: true,
      no1: { blah: "blah" },
      no2: true,
      no3: false,
      no5: {},
      no6: "qwerqwer",
      no7: 99999,
      re1: {
        abc1: "1",
        abc2: "2",
        mm1: 11,
        mm2: "12"
      }
    },
    [
      "hello",
      "sym1",
      "boo1",
      {
        test: ["foo"],
        oops: ["blah", "woo"],
        oops2: ["a", "b"],
        oops3: ["c", "d"],
        sym2: ["x", "y"],
        re1: ["/abc.*/", "mm1"]
      }
    ]
  );

  Tap.same(output, {
    hello: "world",
    test: { foo: "bar" },
    oops: null,
    oops2: undefined,
    oops3: false,
    boo1: true,
    sym1,
    sym2,
    re1: {
      abc1: "1",
      abc2: "2",
      mm1: 11
    }
  });

  test.end();
});