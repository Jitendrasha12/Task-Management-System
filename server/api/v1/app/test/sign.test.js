import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import { signUp } from "../controllers/users/controller.js";
import { generateJwt } from "../../../../helper/jwtHelper.js";
import Joi from "joi";
import Boom from "@hapi/boom";

// Dynamically import sinon to avoid module compatibility issues
const sinonPromise = import("sinon");

describe("signUp Function", () => {
  let request, response, next, stubEncryptPassword, sinon, sinonChai;

  before(async () => {
    const sinonModule = await sinonPromise;
    sinon = sinonModule.default;
  });

  beforeEach(() => {
    request = {
      body: {
        username: "testUser",
        password: "password123",
        email: "test@example.com",
        role: "User",
      },
    };

    response = {
      json: sinon.stub(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should successfully sign up a new user and send a registration email", async () => {
    // Stub Joi.validate
    const validationStub = sinon.stub(Joi, "validate").resolves(request.body);
    // Stub encryptPassword
    const encryptPasswordStub = sinon.stub().resolves("hashedPassword123");
    // Mock user service to return a user object
    const user = {
      _id: "userId123",
      username: "testUser",
      email: "test@example.com",
      role: "User",
    };
    const signUpStub = sinon.stub(userService, "signUp").resolves(user);
    // Stub JWT generation
    const jwtStub = sinon
      .stub(generateJwt, "generateJwt")
      .resolves("testJwtToken");
    // Stub mail notification
    const mailStub = sinon
      .stub(MailNotifier, "registrationSuccessful")
      .resolves();

    // Execute signUp
    await signUp(request, response, next);

    expect(validationStub.calledOnce).to.be.true;
    expect(encryptPasswordStub.calledOnceWith("password123")).to.be.true;
    expect(signUpStub.calledOnceWith(request.body)).to.be.true;
    expect(
      jwtStub.calledOnceWith({
        _id: user._id,
        email: user.email,
        role: user.role,
      })
    ).to.be.true;
    expect(mailStub.calledOnceWith({ to: user.email, username: user.username }))
      .to.be.true;
    expect(response.json.calledOnce).to.be.true;

    const expectedResponse = {
      user,
      token: "testJwtToken",
    };

    expect(response.json.firstCall.args[0]).to.deep.equal({
      data: expectedResponse,
      message: "Sign-up and login successfully",
    });
  });

  it("should return a bad request error when validation fails", async () => {
    const validationError = new Error("Validation Error");
    const validationStub = sinon.stub(Joi, "validate").rejects(validationError);

    await signUp(request, response, next);

    expect(validationStub.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.instanceOf(Boom.Boom);
    expect(next.firstCall.args[0].isBoom).to.be.true;
  });

  it("should handle user service error", async () => {
    sinon.stub(Joi, "validate").resolves(request.body);
    sinon.stub().resolves("hashedPassword123");
    const signUpError = new Error("User Service Error");
    sinon.stub(userService, "signUp").rejects(signUpError);

    await signUp(request, response, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.equal(signUpError);
  });
});
