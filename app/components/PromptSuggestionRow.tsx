import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionRow = ({ onPromptClick }) => {

    const prompts = [
        "Who is the head of racing for Ducati Corse's MotoGP Academy?",
        "Who won the MotoGP championship in 2023?",
        "Who are the main drivers with Yamaha in 2024?"
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
            <PromptSuggestionButton
            key={ `suggestion-${index}`}
            text={prompt}
            onClick={() => onPromptClick(prompt)}
            />)}

        </div>
    )
}

export default PromptSuggestionRow