// src/fakeData.ts
import { faker } from "@faker-js/faker";

/* ---------- Shared cell-value type ---------- */
export type CellValue =
  | string
  | number
  | boolean                // for the “checkbox” column
  | { label: string; color: string }   // status / priority pills
  | { name: string; initials: string } // assignee avatar

/* A row is simply “column-id ➜ cell-value” */
export type FakeRow = Record<string, CellValue>;

/* ---------- Static option lists ---------- */
const statuses: { label: string; color: string }[] = [
  { label: "In Progress", color: "bg-orange-100 text-orange-800" },
  { label: "To Do",        color: "bg-yellow-100 text-yellow-800" },
  { label: "Completed",    color: "bg-green-100 text-green-800" },
  { label: "Blocked",      color: "bg-pink-100 text-pink-800" },
];

const priorities: { label: string; color: string }[] = [
  { label: "Critical", color: "bg-red-600 text-white" },
  { label: "High",     color: "bg-pink-100 text-pink-800" },
  { label: "Medium",   color: "bg-orange-100 text-orange-800" },
  { label: "Low",      color: "bg-yellow-100 text-yellow-800" },
];

/* ---------- Generator ---------- */
export function generateFakeRows(count: number): FakeRow[] {
  return Array.from({ length: count }, () => {
    const fullName = faker.person.fullName();
    const initials = fullName
      .split(" ")
      .map((n) => n[0]!)
      .join("");

    return {
      "col-checkbox": false,
      "col-1": faker.word.words({ count: { min: 2, max: 4 } }),                 // Task name
      "col-2": faker.lorem.sentence({ min: 6, max: 10 }),              // Description
      "col-3": { name: fullName, initials },          // Assigned to
      "col-4": faker.helpers.arrayElement(statuses),  // Status pill
      "col-5": faker.helpers.arrayElement(priorities),// Priority pill
      "col-6": faker.date.future().toLocaleDateString("en-AU"), // Due date
    };
  });
}
