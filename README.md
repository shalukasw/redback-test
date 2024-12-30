# PlayGround

Playground browser application.

## Setup

### Prerequisites

| Tool | Version   |
| ---- | --------- |
| git  | \*        |
| node | >=18.15.0 |
| npm  | >=9.5.0   |

### Installation

1. Clone this repository
   ```bash
   git clone git@github.com:bugboxau/PlayGround.git
   ```
2. change workdirectory to `project`,

   ```bash
   cd Playground
   ```

3. Install project dependencies

   ```bash
   npm i
   ```

### Development

1. Run the app in the development mode, Open [http://localhost:3000](http://localhost:3000) to view it in the browser

   ```bash
   npm run start
   ```

### Building

1. Builds the app for production to the `build` folder.

   ```bash
   npm run build
   ```

## Ecosystem

This application is built using [react.js](https://react.dev/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Libraries

| Package                    | Description                        |
| -------------------------- | ---------------------------------- |
| blockly                    | Build blocks                       |
| codemirror                 | Code preview                       |
| @reduxjs/toolkit           | State management tool              |
| avrgirl-arduino            | Upload hex / binary to arduino     |
| react-bootstrap(bootstrap) | UI component library               |
| bootstrap                  | UI library                         |
| react-router-dom           | Page transition (navigation)       |
| axios                      | HTTP library to make network calls |
| aws-rum-web                | telemetry                          |

## Directory structure

```bash
├── infra
├── public
|  └── media
└── src
   ├── App
   |  ├── Features
   |  |  ├── Common # Shared components, utilities and hooks
   |  |  |  ├── Presentation
   |  |  |  |  ├── Components
   |  |  |  |  ├── Hooks
   |  |  |  |  ├── Providers
   |  |  |  |  ├── Store
   |  |  |  |  └── ViewModels
   |  |  |  └── Repository
   |  |  |     └── Model
   |  |  ├── JoinPlayground
   |  |  |  ├── Presentation
   |  |  |  |  ├── Components
   |  |  |  |  └── Viewmodel
   |  |  |  ├── Repository
   |  |  |  └── Usecase
   |  |  └── Playground
   |  |     ├── Presentation
   |  |     |  ├── Components
   |  |     |  |  ├── CodePlaceholder
   |  |     |  |  ├── CodePreview
   |  |     |  |  ├── Editor
   |  |     |  |  └── Menu
   |  |     |  ├── Screens
   |  |     |  └── ViewModels
   |  |     ├── Repository
   |  |     └── Usecase
   |  ├── Lib # Bugbox blockly extensions
   |  |  └── Blockly
   |  |     ├── blocks # Contains block UI customization and code generation
   |  |     |  ├── comments # comment blocks
   |  |     |  ├── control  # control blocks
   |  |     |  ├── io  # input output blocks
   |  |     └───── variables
   |  └── i18n # Translations
   ├── Assets
   |  ├── Icons
   |  └── Images
   └── Domain # models
      ├── Entity
      ├── Model
      ├── Repository
      └── usecases

```

## Supported platforms

This application will works only on chrome browser, due to the limitation of `serial port` feature in other modern browsers.

### Browser support for features

The following table shows the support for core features of this application

| Feature                     | Browser (version) | supported          |
| --------------------------- | ----------------- | ------------------ |
| Serial port selection       | Chrome            | :white_check_mark: |
| Compilation                 | "                 | :white_check_mark: |
| Code upload to arduino nano | "                 | :white_check_mark: |
| Code generation             | "                 | :white_check_mark: |
| Serial port selection       | Safari            | :x:                |
| Compliation                 | "                 | :white_check_mark: |
| Code upload to arduino nano | "                 | :x:                |
| Code generation             | "                 | :white_check_mark: |

### Note: This application is tested on following devices

| Device      | OS       | tested             | supported          |
| ----------- | -------- | ------------------ | ------------------ |
| Macbook pro | monterey | :white_check_mark: | :white_check_mark: |
| Chromebook  | ??       | ??                 | ??                 |

## Blockly

To extend the bugbox blockly implementation, add block implementation details inside of `src/App/Lib/Blockly/blocks` **defintion** and **generator** files.

There are three types of blockly categories are implemented ot avialable in the current application.

1. Control
2. Input & output
3. Comment

Apart from these custom categories, we have a `variable` category, which is blockly predefined category.

### Block definition

A block definiton is a `javascript` or `json` configuration, that visualizes how the block should look.

### Code generation

Each block definition must have a **generator** file, which will produce a equavalent code.

#### InoScript

`InoScript` is bugbox version code generation implementation, which will combine the generated code, of all the individual blocks, based on the connected nodes (or other blocks).

InoScript now supports following functionalities

1. variables
2. functions
3. `void setup`
4. `void loop`
5. import `definitions` or other declrations including `comments`

#### Adding a new block

![adding a new block](./.github/add-new-block.png)

1. **1** Add `BlockType` in `src/App/Lib/blockly/types.ts`
2. **2, 3** Add definition and generator files under a specific block category folder inside of `src/App/Lib/Blockly/blocks`
3. **4** Add definition and generator imports in `src/App/Lib/Blockly/blocks-registry.ts`
4. **5** Add block in `src/App/Lib/blockly/toolbox.ts` to render the block in toolbox category UI

##### Use generator

Use the following command to complete the steps from [1 to 4](#adding-a-new-block),

```bash
chmod +x scripts/cli.js
# This command will create a block for servo under control category
./scripts/cli.js b servo -c control
```

or

```bash
npm run add-block b servo -- -c control
```

Once the files are generated, add the new block in `toolbox.ts` 


