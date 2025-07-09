# Airtable Clone – Project Tracker

A high-performance Airtable-style UI clone built with [Create T3 App](https://create.t3.gg/), deployed on Vercel, using PostgreSQL, tRPC, TanStack Table, and NextAuth.

---

## Completed

- [x] Project bootstrapped with Create T3 App  
- [x] Vercel deployment with environment variables  
- [x] Google login via NextAuth  
- [x] Create and list user-specific bases  
- [x] Responsive sidebar + top nav (Airtable-like)  
- [x] Clean Tailwind UI with logo and layout  

---

## In Progress

- [ ] Ability to create tables inside bases  
- [ ] Show default rows/columns on new table creation  
- [ ] Use Faker.js to populate data  
- [ ] Display tables with TanStack Table  
- [ ] Editable cells with tab navigation  
- [ ] Dynamic column addition (text, number)  

---

## TODO — High Priority (Week 1–2)

- [ ] Add Tables model + frontend flow  
- [ ] Implement TanStack Table with real data  
- [ ] Add text & number column types  
- [ ] Enable editable cells  
- [ ] Add virtualized scroll (100k+ rows) using TanStack Virtualizer  
- [ ] Button to insert 100k fake rows via Faker.js  
- [ ] Optimize TRPC queries for DB-level scroll  

---

## TODO — Medium Priority (Week 2–3)

- [ ] Add view system per table  
- [ ] Save filters, sorting, visible columns  
- [ ] Filtering (text, number) at DB level  
- [ ] Sorting at DB level  
- [ ] Search across all table cells (full-text)  

---

## TODO — Low Priority (Optional/Polish)

- [ ] Add column hiding UI  
- [ ] Save user layout preferences per view  
- [ ] Animation, theme, polish  

---

## Performance Goals

- [ ] No lag with 1M+ rows  
- [ ] Realtime-like experience (e.g. optimistic updates)  
- [ ] Skeleton or loading state during TRPC calls  

