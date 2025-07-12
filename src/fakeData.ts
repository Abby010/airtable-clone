// src/fakeData.ts
import { faker } from "@faker-js/faker";

export type FakeRow = Record<string, string | number>;

export function generateFakeRows(count: number): FakeRow[] {
  return Array.from({ length: count }, () => ({
    "col-1": faker.person.fullName(),
    "col-2": faker.date.future().toDateString(),
  }));
}
