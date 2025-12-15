# Introduction

Goal of this repository is to show how to setup your system for debugging the LangChainJS library
while developing your own LangChainJS based project.

## Setting up the project

We're going to be setting up the project with just 3 files

- package.json
- tsconfig.json
- src/main.ts

### package.json

We start with a basic package.json file with the following dependencies

- tsx
  - TypeScript Execute (tsx): The easiest way to run TypeScript in Node.js
- @types/node
  - type definitions for all Node.js built-in APIs. (process, fs, path, ....)
- langchain: 
  - LangChain is a framework for building AI tools
- @langchain/openai: 
  - OpenAI integration for LangChain

We also have some scripts to run / develop and build the project.

```
{
  "name": "langchainjs-project",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/main.js",
  "scripts": {
    "start": "tsx src/main.ts",
    "dev": "tsx watch src/main.ts",
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@langchain/openai": "^1.1.3",
    "langchain": "^1.1.1"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "tsx": "^4.20.6"
  }
}


```

### tsconfig.json

Here's a modern version of the tsconfig.json file : 

```
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "moduleDetection": "force",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "rootDir": "src",
    "outDir": "dist",
    "types": ["node"]
  },
  "include": ["src"]
}
```

### src/main.ts

And the star of the show, the main application that we will run in our typescript source file.

```
import { ChatOpenAI } from "@langchain/openai";
import {HumanMessage} from "langchain";

async function main() {
    // your OPENAI_API_KEY must exist in env
    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });

    const res = await model.invoke([
        new HumanMessage("Hello LangChainJS v1 from TypeScript!")
    ]);

    console.log("Response:", res.content);
}

main().catch(console.error);
```


## Debugging

In order to debug the project, we are going to have to 

- clone the langchainjs sources somewhere on your filesystem
- link the sources to the global node_modules folder
- link the sources to your project folder
- add the sources in your IDE

If you don't do this you will get stacks like this that you cannot navigate.
Upon closer inspection, you'll notice that the source files mentioned in this stack do not exist.

```
Error: mime_type key is required for base64 data.
    at convertToOpenAIImageBlock (/Users/davydewaele/Projects/Personal/langchain-tutorial/node_modules/@langchain/core/src/messages/content/data.ts:246:15)
    at _formatForTracing (/Users/davydewaele/Projects/Personal/langchain-tutorial/node_modules/@langchain/core/src/language_models/chat_models.ts:172:17)
    at Array.map (<anonymous>)
    at ChatOpenAI._generateUncached (/Users/davydewaele/Projects/Personal/langchain-tutorial/node_modules/@langchain/core/src/language_models/chat_models.ts:456:22)

Node.js v20.17.0

Process finished with exit code 1

```

What you want is this. 

Links that work to actual source code on your filesystem.

```
Error: mime_type key is required for base64 data.
    at convertToOpenAIImageBlock (/private/tmp/langchainjs/libs/langchain-core/src/messages/content/data.ts:246:15)
    at _formatForTracing (/private/tmp/langchainjs/libs/langchain-core/src/language_models/chat_models.ts:172:17)
    at Array.map (<anonymous>)
    at ChatOpenAI._generateUncached (/private/tmp/langchainjs/libs/langchain-core/src/language_models/chat_models.ts:456:22)

```

So how do we do that ?

Lets go over all these steps : 

### Clone the sources

Clone the sources from the langchainjs repository :

```
git clone https://github.com/langchain-ai/langchainjs
```

Just make sure they are somewhere on your filesystem. The don't need to be in the same folder as your project.
We will link the sources to our typescript folder later on


### Global linking

Global linking creates a global symlink to a local package so other projects can consume it as if it were installed, while still editing the source locally.
If we apply this to the LangChainJS sources, instead of installing LangChainJS from npmjs, we can now have it point to a locally checkout source folder of LangChainJS.

This has may advantages

- pointing to the actual source code
- allows you to make changes to the source code.

In the sources folder you can use the following commands : 

- `pnpm build` : to build the entire project
- `pnpm link --global` Global linking the sources
- `pnpm unlink --global` Unlink the project globally

if you have a more complex project like langchainjs containing several modules, you will need to link each module individually.

For example, langchainjs contains the following modules :

- langchain
- @langchain/core
- @langchain/openai

These are located in the langchainjs/packages folder

- langchainjs/langchain
- langchainjs/langchain-core
- langchainjs/libs/langchain-openai

In order to link the @langchain/core module, you will need to run the following command : 

```
pnpm link --global @langchain/core
```

clone the sources somewhere on your filesystem
In the sources folder : 

- use pnpm build to build the project
- use pnpm link --global to link the project globally

## Link the sources to your project folder

Next thing we need to do is link the sources to our project folder.

```
pnpm link --global @langchain/core
```

This will create a symlink in your global node_modules folder.
So instead of pointing to a download of an npmjs package, we will now point to a symlink to the sources.

However, this is not sufficient. As there source files are not visible to your IDE we will need to link them.

This is done by adding the sources in your WebStorm IDE.
Click `Command` + `,` and go to the Directories section and add a content root

![img.png](docs/img_6.png)

Folder structure
![img.png](docs/img.png)

Add a breakpoint 
![img_1.png](docs/img_1.png)

breakpoint hit
![img_2.png](docs/img_2.png)

Stack trace
![img_3.png](docs/img_3.png)


View all frames

![img_4.png](docs/img_4.png)

![img_5.png](docs/img_5.png)