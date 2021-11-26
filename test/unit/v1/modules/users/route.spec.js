const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const postStub = sinon.stub();
const patchStub = sinon.stub();
const getStub = sinon.stub();
const deleteStub = sinon.stub();

const handlersStub = {
  create: "CREATE",
  get: "GET",
  update: "UPDATE",
  delete: "DELETE",
  list: "LIST",
};

const router = proxyquire("@modules/users/route", {
  express: {
    Router: () => {
      return {
        post: postStub,
        get: getStub,
        patch: patchStub,
        delete: deleteStub,
      };
    },
  },
  "./handler": handlersStub,
})();

describe(`users > router > `, () => {
  it(`should have called POST for create operation`, () => {
    expect(postStub.getCall(0).calledWithExactly("/users", "CREATE")).toBe(true);
  });

  it(`should have called PATCH for update operation`, () => {
    expect(patchStub.calledOnceWithExactly("/users/:id?", "UPDATE")).toBe(true);
  });

  it(`should have called GET for get operation`, () => {
    expect(getStub.calledOnceWithExactly("/users/:id?", "GET")).toBe(true);
  });

  it(`should have called DELETE for delete operation`, () => {
    expect(deleteStub.calledOnceWithExactly("/users/:id?", "DELETE")).toBe(true);
  });

  it(`should have called POST for list operation`, () => {
    expect(postStub.getCall(1).calledWithExactly("/users/list", "LIST")).toBe(true);
  });

  it(`should return the router on the exported method`, () => {
    expect(router).not.toBe(null);
    expect(Object.keys(router).length).toBe(4);
  });
});
