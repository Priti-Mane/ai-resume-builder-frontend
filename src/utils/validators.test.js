import { describe, test, expect } from "vitest";
import { isValidEmail, passwordsMatch } from "./validators";

describe("isValidEmail", () => {
  test("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("rejects invalid emails", () => {
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("passwordsMatch", () => {
  test("returns true when passwords match and are non-empty", () => {
    expect(passwordsMatch("secret123", "secret123")).toBe(true);
  });

  test("returns false when passwords do not match", () => {
    expect(passwordsMatch("secret123", "different")).toBe(false);
  });

  test("returns false when both passwords are empty", () => {
    expect(passwordsMatch("", "")).toBe(false);
  });
});
