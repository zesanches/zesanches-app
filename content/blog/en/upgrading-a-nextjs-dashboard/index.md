---
title: "How I verified a Next.js dashboard upgrade, down to the color of a table header"
date: "2026-11-16"
excerpt: "In three working days, the yarn audit count dropped from 405 vulnerabilities to 21. Finding out why a table header had turned darker took running two versions of the dashboard side by side."
tags: ["Next.js", "React", "Tailwind CSS", "Cypress"]
author: "José Sanches"
---

The table still showed the same data in the same order. Only the header looked a little darker. If you wrote a Cypress test to check the contents of every cell, it would pass on both versions. So how would you find the CSS rule that changed the color?

That question came up while I was upgrading a dashboard for scheduling freight loads and filling out checklists. A `yarn audit` had flagged **405 vulnerabilities, including 8 critical and 208 high-severity findings**. Many came from packages installed by other libraries. Between November 12 and 16, I split the upgrade into seven commits. Building the application and running the tests at each step gave me a point of comparison whenever something changed.

## 1. What needed to move first?

I started by moving Node from 20 to 24 LTS in Docker and CI. Upgrading Cypress from 14 to 16 required a newer runtime, so it made sense to prepare the environment before changing the test suite I'd rely on for the rest of the migration. The project also had two files describing its dependency tree. Since it used Yarn to install packages, I removed `package-lock.json` and kept `yarn.lock`.

Next up was Next.js 15 to 16. Turbopack stopped the build on an import that webpack had tolerated. Following that import led me to the public terms of use and privacy page. It had been calling the wrong API since May. The compiler change exposed a bug that was already in production.

Moving from React 18 to 19 had a different prerequisite. The dashboard used `react-input-mask`, which was incompatible with the new release, and the backend supplied one of the input masks. Its syntax had to keep working. I put the conversion in a `MaskedInput` component backed by `use-mask-input` and added eight tests for the replacement. The forms could keep accepting the same masks.

## 2. Which CSS rule wins when two target the same field?

The upgrades from Tailwind 3 to 4 and from Mantine 5 to 9 belonged together. Mantine 5 generated styles at runtime with Emotion. With Mantine 9's static CSS and Tailwind 4's utility classes, I could organize both sets of rules into **cascade layers** (`@layer`). For normal declarations in the same stylesheet, the browser considers layer precedence before selector specificity.

The form fields were a good example. Styles from `@tailwindcss/forms` landed in the `utilities` layer and overrode fields we'd already customized. I removed the plugin and moved its CSS into the `components` layer. A utility class on an individual input could then override the default field style.

Tailwind's upgrade tool handled 51 components. Our main stylesheet, though, ran to 753 lines and used `@apply` about 150 times. The tool generated invalid selectors there, so I migrated that file by hand. For the tables, I replaced selectors that depended on Emotion's hashes with the stable `mantine-datatable-*` classes.

## 3. What did the pixels show?

I used two **Git worktrees** to run the baseline and the upgraded app in separate directories. At each step I compared screenshots of the same views with `pixelmatch`. The sample covered 23 screens, including checks in light and dark themes and at a mobile viewport size.

On the table from the opening example, the difference ran the full width of the header. Each header cell (`th`) painted its translucent background over a second background on the row (`tr`). The overlap produced the darker shade. The fix fit in one rule.

```css
thead tr {
  background: inherit;
}
```

Once the row inherited the header's background, the admin screens with tables showed a **0.00% pixel difference**. Across the whole sample, the largest remaining difference was 0.22% of pixels, confined to text antialiasing and scrollbars.

## 4. How do you read the test results?

| Check | Before | After |
| --- | --- | --- |
| Vulnerabilities reported by `yarn audit` | 405 | 21 (18 moderate and 3 low) |
| Passing component tests | 118 of 118 | 126 of 126 |
| Passing end-to-end tests | 69 of 75 | 70 of 75 |

The eight new checks covered the input mask. The five remaining end-to-end failures also occurred on the baseline. One test looked for a password reset link that had changed. Others used incomplete fixtures and exposed a `null` access when filling out a checklist.

I also got SonarQube running in CI again after 13 months. Its job had to wait for Cypress to produce the test artifact. Once the analysis ran, I fixed all 11 findings. The **Quality Gate** still failed on duplication, missing coverage on new code, and security hotspots awaiting review.

## Conclusion

After three working days, the audit reported **95% fewer vulnerabilities**, with zero critical or high-severity findings. Staging QA and a check of which browsers our customers used were still pending before merge. A mobile screenshot tells you a lot about the layout, but someone opening the dashboard on an older iPad also depends on the version of Safari it can run.

The habit I'm taking from this migration is to keep a runnable baseline before the first upgrade. When Cypress failed on both versions, I could reproduce the problem on the old code. When just the header changed color, I knew exactly which row to inspect.

---

**Sources**

- Migration report, November 16, 2026. Source of the measurements and results in this case study.
- Tailwind CSS. [Version 4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide).
- W3C. [CSS Cascading and Inheritance Level 5 — Cascade Layers](https://www.w3.org/TR/css-cascade-5/#layering).
