Work on a solution for the chapters (challenges) below, share your code.

Happy coding ❤️

## 🗃️ Chapter I ~ A table to rule them all

### Pre-requirement
The entry file is `parser.html`

### Requirements
- As a user, I want to upload different people details files and see the data in a `<table>`.
- As a system, I want to allow only `.csv` files
- As a system, I want to show an error if the file format is not valid.

### Restriction
- You should be able to parse and display data from the valid files in the `../fixtures` directory.
- You can use **only** VanillaJs.

## 🤩 Chapter II ~ Improve the UX

### Pre-requirement
The entry file is `index.html`
You have to achieve all the `Chapter I` requirements.
You have to use the same parsing logic from the past chapter.
You might need extra dependencies to package.json to work with `.scss` files

### Requirements
- As a user, I want to search data by `firstName`. Only the relevant rows should appear.
- As a developer, I want to style the table without the `<table>` tag.

### Restriction
- You have to use *React* for the handling UI.

### Installation 
To install dependencies run the command
```bash
  $ npm i
```

### Development 
To run the project use the command
```bash
  $ npm run watch
```

## 🚀 Chapter III ~ Get ready for production!

### Pre-requirement
You have to use the same source code from the past chapter.

### Requirements
- As a user, I want to persist the last read file (even if the browser is closed) until a new file is uploaded.
- As a developer, I want to hide some columns automatically in low-resolution screen.
- As a developer, I want to test the parsing logic.

### Restriction
- You can use any unit test library (es. [mocha](https://mochajs.org/), [jest](https://jestjs.io/) or similar).

## 👩‍🎤 Bonus Points
- Have a great commit history
- Host and serve the application online
