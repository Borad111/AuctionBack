import { hashPassword, comparePassword } from "../../utils/hashPassword";

describe("hashPassword utility", () => {

  it("should hash the password", async () => {
    const plainPassword = "mySecret123";
    const hash = await hashPassword(plainPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(plainPassword);
  });

  it("should return true for correct password", async () => {
    const plainPassword = "mySecret123";
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hash);

    expect(isMatch).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const plainPassword = "mySecret123";
    const hash = await hashPassword(plainPassword);
    const isMatch = await comparePassword("wrongPassword", hash);

    expect(isMatch).toBe(false);
  });
});