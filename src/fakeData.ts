// src/fakeData.ts
import { faker } from "@faker-js/faker";

export type Row = {
  id: string;
  name: string;
  email: string;
  age: number;
};

export function generateFakeRows(count: number): Row[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 65 }),
  }));
}
