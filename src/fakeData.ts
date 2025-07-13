// src/fakeData.ts
import { faker } from "@faker-js/faker";

export type FakeRow = Record<string, any>;

const statuses = [
  { label: "In Progress", color: "bg-orange-100 text-orange-800" },
  { label: "To Do", color: "bg-yellow-100 text-yellow-800" },
  { label: "Completed", color: "bg-green-100 text-green-800" },
  { label: "Blocked", color: "bg-pink-100 text-pink-800" },
];

const priorities = [
  { label: "Critical", color: "bg-red-600 text-white" },
  { label: "High", color: "bg-pink-100 text-pink-800" },
  { label: "Medium", color: "bg-orange-100 text-orange-800" },
  { label: "Low", color: "bg-yellow-100 text-yellow-800" },
];

export function generateFakeRows(count: number): FakeRow[] {
  return Array.from({ length: count }, () => {
    const name = faker.person.fullName();
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");

    return {
      "col-checkbox": false,
      "col-1": faker.lorem.words(3),
      "col-2": faker.lorem.sentence(6),
      "col-3": { name, initials },
      "col-4": faker.helpers.arrayElement(statuses),
      "col-5": faker.helpers.arrayElement(priorities),
      "col-6": faker.date.future().toLocaleDateString("en-AU"),
    };
  });
}
