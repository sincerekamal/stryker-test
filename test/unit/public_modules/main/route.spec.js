const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const postStub = sinon.stub();
const getStub = sinon.stub();

const handlersStub = {
  signup: "SIGNUP",
  get: "GET",
  createToken: "CREATE_TOKEN",
};

const router = proxyquire("@public/main/route", {
  express: {
    Router: () => {
      return {
        post: postStub,
        get: getStub,
      };
    },
  },
  "./handler": handlersStub,
})();

describe(`public > main > router > `, () => {
  it(`should have called POST for signup operation`, () => {
    expect(postStub.getCall(0).calledWithExactly("/signup", "SIGNUP")).toBe(
      true
    );
  });

  it(`should have called GET for get operation`, () => {
    expect(getStub.calledOnceWithExactly("/", "GET")).toBe(true);
  });

  it(`should have called POST for create token operation`, () => {
    expect(
      postStub.getCall(1).calledWithExactly("/create_token", "CREATE_TOKEN")
    ).toBe(true);
  });

  it(`should return the router on the exported method`, () => {
    expect(router).not.toBe(null);
    expect(Object.keys(router).length).toBe(2);
  });
});
