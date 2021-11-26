const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const payloadValidatorStub = sinon.stub();
const controllerStub = sinon.stub();
const nextStub = sinon.stub();
const res = {
  locals: {},
};
const req = {
  body: { bodyKey: 1 },
  params: { id: "m1" },
};

describe(`meals > handler > `, () => {
  beforeEach(() => {
    controllerStub.resolves({});
    payloadValidatorStub.returns({ validatedKey: 1 });
  });

  afterEach(() => {
    payloadValidatorStub.reset();
    controllerStub.reset();
    nextStub.resetHistory();
  });

  describe(`create`, () => {
    const { create } = proxyquire("@modules/meals/handler", {
      "./payload_validators": {
        create: payloadValidatorStub,
      },
      "./controllers": {
        create: controllerStub,
      },
    });

    it(`should bubble up error from payload validator`, async () => {
      payloadValidatorStub.throws(new Error("validation error"));

      await create(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("validation error");
    });

    it(`should bubble up error from controller`, async () => {
      controllerStub.rejects(new Error("controller error"));

      await create(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("controller error");
    });

    it(`should call payload validator with req.body`, async () => {
      await create(req, res, nextStub);

      expect(payloadValidatorStub.args[0][1]).toEqual({
        bodyKey: 1,
      });
    });

    it(`should call controller with validated payload`, async () => {
      await create(req, res, nextStub);

      expect(
        controllerStub.calledOnceWithExactly(res.locals, { validatedKey: 1 })
      ).toBe(true);
    });

    it(`should call next without any args for successful result`, async () => {
      await create(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`update`, () => {
    const { update } = proxyquire("@modules/meals/handler", {
      "./payload_validators": {
        update: payloadValidatorStub,
      },
      "./controllers": {
        update: controllerStub,
      },
    });

    it(`should bubble up error from payload validator`, async () => {
      payloadValidatorStub.throws(new Error("validation error"));

      await update(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("validation error");
    });

    it(`should bubble up error from controller`, async () => {
      controllerStub.rejects(new Error("controller error"));

      await update(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("controller error");
    });

    it(`should call payload validator with req.body+req.params`, async () => {
      await update(req, res, nextStub);

      expect(payloadValidatorStub.args[0][1]).toEqual({
        bodyKey: 1,
        id: "m1",
      });
    });

    it(`should call controller with validated payload`, async () => {
      await update(req, res, nextStub);

      expect(
        controllerStub.calledOnceWithExactly(res.locals, { validatedKey: 1 })
      ).toBe(true);
    });

    it(`should call next without any args for successful result`, async () => {
      await update(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`list`, () => {
    const { list } = proxyquire("@modules/meals/handler", {
      "./payload_validators": {
        list: payloadValidatorStub,
      },
      "./controllers": {
        list: controllerStub,
      },
    });

    it(`should bubble up error from payload validator`, async () => {
      payloadValidatorStub.throws(new Error("validation error"));

      await list(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("validation error");
    });

    it(`should bubble up error from controller`, async () => {
      controllerStub.rejects(new Error("controller error"));

      await list(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("controller error");
    });

    it(`should call payload validator with req.body`, async () => {
      await list(req, res, nextStub);

      expect(payloadValidatorStub.args[0][1]).toEqual({
        bodyKey: 1,
      });
    });

    it(`should call controller with validated payload`, async () => {
      await list(req, res, nextStub);

      expect(
        controllerStub.calledOnceWithExactly(res.locals, { validatedKey: 1 })
      ).toBe(true);
    });

    it(`should call next without any args for successful result`, async () => {
      await list(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`delete`, () => {
    const { delete: deleteH } = proxyquire("@modules/meals/handler", {
      "./payload_validators": {
        delete: payloadValidatorStub,
      },
      "./controllers": {
        delete: controllerStub,
      },
    });

    it(`should bubble up error from payload validator`, async () => {
      payloadValidatorStub.throws(new Error("validation error"));

      await deleteH(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("validation error");
    });

    it(`should bubble up error from controller`, async () => {
      controllerStub.rejects(new Error("controller error"));

      await deleteH(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("controller error");
    });

    it(`should call payload validator with req.params`, async () => {
      await deleteH(req, res, nextStub);

      expect(payloadValidatorStub.args[0][1]).toEqual({
        id: "m1",
      });
    });

    it(`should call controller with validated payload`, async () => {
      await deleteH(req, res, nextStub);

      expect(
        controllerStub.calledOnceWithExactly(res.locals, { validatedKey: 1 })
      ).toBe(true);
    });

    it(`should call next without any args for successful result`, async () => {
      await deleteH(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`get`, () => {
    const { get } = proxyquire("@modules/meals/handler", {
      "./payload_validators": {
        get: payloadValidatorStub,
      },
      "./controllers": {
        get: controllerStub,
      },
    });

    it(`should bubble up error from payload validator`, async () => {
      payloadValidatorStub.throws(new Error("validation error"));

      await get(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("validation error");
    });

    it(`should bubble up error from controller`, async () => {
      controllerStub.rejects(new Error("controller error"));

      await get(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("controller error");
    });

    it(`should call payload validator with req.params`, async () => {
      await get(req, res, nextStub);

      expect(payloadValidatorStub.args[0][1]).toEqual({
        id: "m1",
      });
    });

    it(`should call controller with validated payload`, async () => {
      await get(req, res, nextStub);

      expect(
        controllerStub.calledOnceWithExactly(res.locals, { validatedKey: 1 })
      ).toBe(true);
    });

    it(`should call next without any args for successful result`, async () => {
      await get(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });
});
