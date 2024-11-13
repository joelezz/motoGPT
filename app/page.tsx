"use client"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble  from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";

import Image from "next/image";

import f1GPTLogo from "./assets/F1GPT.png";

const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()
    const noMessages = !messages || messages.length === 0
    const handlePrompt = ( promptText ) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user",
        }
        append(msg)
    }
    return (
        <main>
            <Image src={f1GPTLogo} width="250" alt="F1GPT Logo"/>
            <section className={noMessages ? "" : "populated" }>
        {noMessages ? (
            <>
            <p className="starter-text">
                The Ultimate place for Formula One super fans!
                Ask F1GPT anything about the fantastic topic of 
                Formula One and it will give you the most relevant answers back.
                We hope you will enjoy!
            </p>
            <br/>
            <PromptSuggestionRow onPromptClick={handlePrompt}/>
            </>
        ) : (
            <>
            {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/> )}
            { isLoading && <LoadingBubble/> }
            </>
        )}

            </section>
            <form onSubmit={handleSubmit}>
            <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something"/>
            <input type="submit" />
        </form>
        </main>
    );
};

export default Home;

