import { ChatOpenAI } from "@langchain/openai";
import {HumanMessage} from "langchain";

async function main() {
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