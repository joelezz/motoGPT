import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts"


const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request) {
    try {
       const {messages} = await req.json()
       const latestMessage = messages[messages?.length - 1]?.content
       let docCoctext = ""

       const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float"
       })

       try {
           const collection = await db.collection(ASTRA_DB_COLLECTION)
           const cursor = collection.find(null, {
            sort: {
                $vector: embedding.data[0].embedding,
            },
            limit: 10
           })

           const documents = cursor.toArray()
           const docsMap = (await documents)?.map(doc => doc.text)
           docCoctext = JSON.stringify(docsMap)


    } catch (err) {
        console.log("Error querying db...")
        docCoctext = ""
    }

    const template = {
        role: "system",
        content: `You are an AI assistant who knows everything about MotoGP.
        The context will provide you with the most recent page data from Wikipedia
        the official MotoGP ebsite and others.
        If the context doesnt include the information you need to answer based on existing knoiwledge and dont mention
        the source  of your information or what the context does or does not include.
        Format responces using markdown where applicapble and dont return images
        -----------------
        START CONTEXT
        ${docCoctext}
        END CONTEXT
        -----------------
        QUESTION: ${latestMessage}
        -----------------
        `
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4o-small",
        stream: true,
        messages: [template, ...messages]
    })
    const stream = new OpenAI(response)
    return new Response(stream)
} catch (err) {
    throw err
}
}
