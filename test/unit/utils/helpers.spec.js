describe(`helpers > `, () => {
  describe(`getDataScope >`, () => {
    const { getDataScope } = require("@utils/helpers");
    it(`should return proper values for self user`, () => {
      const user = { role_id: 1, id: "user1" };

      const result = getDataScope(user);

      expect(result).toEqual({ method: ["own", "user1"] });
    });

    it(`should return proper values for manager user`, () => {
      const user = { role_id: 2, id: "user1" };

      const result = getDataScope(user);

      expect(result).toEqual({ method: ["manager", "user1"] });
    });

    it(`should return proper values for admin user`, () => {
      const user = { role_id: 3, id: "user1" };

      const result = getDataScope(user);

      expect(result).toEqual("admin");
    });

    it(`should return nothing for unmatched user role id`, () => {
      const user = { role_id: 4, id: "user1" };

      const result = getDataScope(user);

      expect(result).toEqual(undefined);
    });
  });

  describe(`replaceOps >`, () => {
    const { replaceOps } = require("@utils/helpers");
    it(`should return query as it is if length is less than 6 chars`, () => {
      const query = " eq ";

      const result = replaceOps(query);

      expect(result).toBe(" eq ");
    });

    it(`should return query as it is if query is not string`, () => {
      const query = 1;

      const result = replaceOps(query);

      expect(result).toBe(1);
    });

    it(`should replace eq with = `, () => {
      const query = "a eq b";

      const result = replaceOps(query);

      expect(result).toBe(`a = b`);
    });

    it(`should replace gt with > `, () => {
      const query = "a gt b";

      const result = replaceOps(query);

      expect(result).toBe(`a > b`);
    });

    it(`should replace gte with >= `, () => {
      const query = "a gte b";

      const result = replaceOps(query);

      expect(result).toBe(`a >= b`);
    });

    it(`should replace lt with < `, () => {
      const query = "a lt b";

      const result = replaceOps(query);

      expect(result).toBe(`a < b`);
    });

    it(`should replace lte with <= `, () => {
      const query = "a lte b";

      const result = replaceOps(query);

      expect(result).toBe(`a <= b`);
    });

    it(`should replace ne with != `, () => {
      const query = "a ne b";

      const result = replaceOps(query);

      expect(result).toBe(`a != b`);
    });

    it(`should replace repeating same ops with respective symbol `, () => {
      const query = "a eq b AND b eq c";

      const result = replaceOps(query);

      expect(result).toBe(`a = b AND b = c`);
    });

    it(`should replace multiple, repeating ops with respective symbols`, () => {
      const query =
        "a eq b AND b eq c OR (d gte 3) AND (e lte 4) and (e lte 5)";

      const result = replaceOps(query);

      expect(result).toBe(
        `a = b AND b = c OR (d >= 3) AND (e <= 4) and (e <= 5)`
      );
    });
  });
});
