# User Normalization Assessment

This coding assessment evaluates your ability to work with real-world data inconsistencies using TypeScript and Node.js.

Please expect to spend approximately two hours on this assessment, and no more than four hours in total. While we will not constrain your access to this time period, completing this assessment does not guarantee employment. The code assessment is only one aspect of the application process.

## Abstract

The behavior of external systems can change without warning—especially if they are not properly versioned. Key systems can often rely on external APIs for critical functionality. As such, it is essential that senior engineers on our team are able to create solutions that withstand changes introduced by external dependencies.

In this assessment, you'll work with such a system. An endpoint will be provided that returns valid results, but the response format is intentionally inconsistent due to a (contrived) issue on the provider's end.

## Objective

Build a TypeScript implementation that retrieves user data from a secure REST endpoint and transforms it into a normalized format. The endpoint will return JSON data in varying formats, randomly selected from a predefined set. Your solution should account for this unpredictability and normalize the response into a consistent output format.

This exercise evaluates your ability to:
- Write resilient, defensive code.
- Handle varied, unpredictable data structures.
- Preserve functionality when faced with non-uniform inputs.

### 🔍 Important

The endpoint returns user objects in **approximately 15 different formats**. Each request returns a random variation, so **multiple calls** are likely needed to test your implementation thoroughly. After submission, your implementation will be tested against all 15 responses that you may encounter during development/testing, as well as an additional **five unique response formats** which have been reserved for evaluation.

## Tasks

1. Implement a solution in `src/normalizer.ts` that:
   - Fetches data from an authorized endpoint:
     ```
     https://us-central1-txtsmarter-dev.cloudfunctions.net/codeassessment/user
     ```
   - Transforms the response into the `UserRecord` format described below.
   - Logs and returns the normalized user record.

```ts
enum EContactMethod {
    phone = "phone",
    email = "email",
    none = "none"
}

interface UserRecord {
    id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    primaryPhone?: string;
    roles: string[];
    preferredContactMethod?: EContactMethod;
}
```

2. Provide **two unit tests**:
   - One for a **happy path** case
   - One for a **failure** or edge case

> ⚠️ _Note:_ &nbsp; Your implementation should strive to **gracefully handle unknown or incomplete data** wherever possible. Use your best judgment to balance robustness with simplicity.

> _Also note:_ &nbsp; The optional tasks below are truly optional. Completing them is not required for a successful submission. If the evaluator is satisfied that your implementation meets the requirements outlined above, the evaluation of optional requirements **will be skipped**.

3. _(Optional)_ Validate the transformed object using Joi or Zod.

4. _(Optional)_ Add unit tests for at least **three additional happy path** response variations.

## Requirements

To complete this assessment, you will need the following:

- Node.js v18 or higher
- npm (v8 or higher)
- TypeScript (project is already configured)
- Internet access (to query the secure endpoint)
- A valid JWT provided by SnippetSentry

## Getting Started

You can use the JWT provided by SnippetSentry in place of `<jwt_goes_here>`. A starting implementation is included that logs the raw response from the endpoint so you can focus your effort on normalization.

> Your provided JWT should be valid for **5 days**. If it expires early, please contact the hiring manager for a replacement.

```bash
npm install
AUTH_TOKEN=<jwt_goes_here> npm run dev
```

## Wrapping Up

When finished, please host your solution in a **public repository** and share the link with us. A **private repository** is also acceptable if hosted on GitHub, GitLab, or Bitbucket. Please inform the manager who shared this assessment if you opt for a private repo so that proper access can be granted.
