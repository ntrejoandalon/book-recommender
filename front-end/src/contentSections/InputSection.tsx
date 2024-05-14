import App, { AppState } from "../App";
import './InputSection.css';

interface props {
    handleSubmit: Function,
    setBookTitle: Function,
    setDescription: Function,
    setAppState: Function
}

const InputSection: React.FC<props> = ({ handleSubmit, setBookTitle, setDescription, setAppState }) => {
    function handleFormSubmission() {
        handleSubmit();
    }

    return (
        <header className="App-header">
            <p>Insert the title of a book you like and a description of what you want to see.</p>

            <>
                <label>Book Title</label>
                <br></br>
                <input type="text" id="query" name="q" onChange={(e: any) => setBookTitle(e.target.value)} />
            </>
            <>
                <label>Book Description</label>
                <br></br>
                <input type="text" id="query" name="q" onChange={(e: any) => setDescription(e.target.value)} />
            </>
            <br></br>
            <br></br>

            <input type="button" value="SUBMIT" onClick={handleFormSubmission} />
        </header >
    )
}

export default InputSection;
