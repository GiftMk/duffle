# Overview

Duffle is a collaborative markdown editing app that works on the concept of brain dumps. Instead of organizing files and folders, users just write and write some more. When they want to access their knowledge they can search (fuzzy or semantic) or even ask to use an agent.

# Code Style

## General

- prefer multiple focused files over monolithic files
  - Here, follow the established patterns to decide when to split versus keep in a single file
  - In cases where the code is highly cohesive like a Dialog component split into Root, Overlay, Popover etc. keeping it all in the same file is fine
  - A good rule of thumb is "If I would write a test suite for each individual function/component in this file, break it up into separate files"
  - We prefer readable variable names. So `networkAddress` is preferred to `netAddr`. And `dbConnection` is preferred over `dbConn`. Note that abbreviations like `db` are okay if they are ubiquitous, industry standards.
- Before copying existing code and pasting it into a new scenario, think "Could this code be generalized or abstracted better?".
  - For example if there's a bit of code that formats a date, instead of copying the raw code, make a reusable util for it when practical.

## TypeScript / TSX

- prefer arrow functions for all function definitions
- Avoid nested ternaries
- Avoid inline logic and inline function definitions in TSX (unless it is trivially simple)
  **Bad**
  ```tsx
  return (
    <button onClick={() => setValue((prev) => prev + 1)}>
      {value > 1 && value < 20 ? "average" : "strange"}
    </button>
  );
  ```
  **Good**
  ```tsx
  const handleClick = () => {
    setValue((prev) => prev + 1);
  };

  const label = value > 1 && value < 20 ? "average" : "strange";

  return <button onClick={handleClick}>{label}</button>;
  ```
- Avoid components getting bloated with hooks. Generally if a component looks like it contains a lot (roughly 3 or more) large hooks, split it out into a custom hook kept in the `/hooks` folder
