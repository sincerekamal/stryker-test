const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const controllerStub = sinon.stub();
const payloadValidatorStub = sinon.stub();
const nextStub = sinon.stub();

const req = {
  params: { paramKey: 1 },
  body: { bodyKey: 1 },
};

const res = {
  locals: {},
};

describe(`public_modules > main >`, () => {
  describe(`get > `, () => {
    const { get } = proxyquire("@public/main/handler", {
      "./controllers": {
        get: controllerStub,
      },
    });

    beforeEach(() => {
      nextStub.reset();
      controllerStub.reset();
      payloadValidatorStub.reset();
      controllerStub.resolves({});
      payloadValidatorStub.returns({ validatedPayload: 1 });
    });

    it(`should pass controller error to next`, async () => {
      controllerStub.rejects(new Error("c error"));

      await get(req, res, nextStub);

      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("c error");
      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
      expect(controllerStub.calledOnceWithExactly(res.locals, req.params)).toBe(
        true
      );
    });

    it(`should pass control to next on success`, async () => {
      await get(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`signup > `, () => {
    const { signup } = proxyquire("@public/main/handler", {
      "./controllers": {
        signup: controllerStub,
      },
      "./payload_validators": {
        signup: payloadValidatorStub,
      },
    });

    beforeEach(() => {
      nextStub.reset();
      controllerStub.reset();
      payloadValidatorStub.reset();
      controllerStub.resolves({});
      payloadValidatorStub.returns({ validatedPayload: 1 });
    });

    it(`should pass payload validator error to next`, async () => {
      payloadValidatorStub.throws(new Error("v error"));

      await signup(req, res, nextStub);

      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("v error");
      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
    });

    it(`should pass controller error to next`, async () => {
      controllerStub.rejects(new Error("c error"));

      await signup(req, res, nextStub);

      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("c error");
      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
    });

    it(`should pass control to next on success`, async () => {
      await signup(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });

  describe(`createToken > `, () => {
    const { createToken } = proxyquire("@public/main/handler", {
      "./controllers": {
        createToken: controllerStub,
      },
      "./payload_validators": {
        createToken: payloadValidatorStub,
      },
    });

    beforeEach(() => {
      nextStub.reset();
      controllerStub.reset();
      payloadValidatorStub.reset();
      controllerStub.resolves({});
      payloadValidatorStub.returns({ validatedPayload: 1 });
    });

    it(`should pass payload validator error to next`, async () => {
      payloadValidatorStub.throws(new Error("v error"));

      await createToken(req, res, nextStub);

      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("v error");
      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
    });

    it(`should pass controller error to next`, async () => {
      controllerStub.rejects(new Error("c error"));

      await createToken(req, res, nextStub);

      expect(nextStub.args[0][0] instanceof Error).toBe(true);
      expect(nextStub.args[0][0].message).toBe("c error");
      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(1);
    });

    it(`should pass control to next on success`, async () => {
      await createToken(req, res, nextStub);

      expect(nextStub.calledOnce).toBe(true);
      expect(nextStub.args[0].length).toBe(0);
    });
  });
});
