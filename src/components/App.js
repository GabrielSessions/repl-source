import React, {useState} from "react";
import Header from "./Header";
import IDE from "./IDE";
import Tabs from"./Tabs/Tabs";
import Serial from "./Serial/Serial"


function App() {

    const ENTER = '\r\n'; // NEWLINE character
    const LOCALSTORAGE_KEY = "appData";

    let editorInitialValue = null;
    const ls = getLocalStorage()
    if (ls == null) {
        editorInitialValue = [{
            name: "Main",
            id: 0,
            code: ""
        }]
    }
    else {
        editorInitialValue = [];
        const lsJSON = JSON.parse(ls)
        Object.values(lsJSON).forEach((value, key) => {
            editorInitialValue.push(value);
        });
        
    }

    const [editors, setEditors] = useState(editorInitialValue);

    const [activeIDE, setActiveIDE] = useState(0);
    const [consoleOutput, setConsoleOutput] = useState("");


    // Make sure editor names are unique!
    function addREPL(newEditorName) {
        setEditors((prev) => {
            return ([...prev, {
                name: newEditorName,
                id: (prev.length + 1),
                code: ""
            }])
        })
    }

    function pipeOutputToConsole(value) {
        setConsoleOutput((prev) => {
            return prev + value;
        })
    }


    // Changes the code of the IDE that is currently activated
    function editCurrentFile(newCode) {
        setEditors((prev) => {
            prev[activeIDE].code = newCode;
            return (prev);
        })

        saveToLocalStorage();
    }

    function getCurrentCode() {
        return editors[activeIDE].code;
    }

    function saveToLocalStorage() {
        let editorJSON = {}
        editors.forEach((element, index) => {
            editorJSON[index]  = element;
        });
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(editorJSON))
        
    }

    function getLocalStorage() {
        return localStorage.getItem(LOCALSTORAGE_KEY);
    }


    // Outputs serial directions and a button to connect to WebSerial
    return (
        <div>
            <Header />
            <div className="grid grid-cols-2">
                <div className="flex mx-2 justify-center">
                    <Tabs switchIDE = {setActiveIDE} addREPL={addREPL} />
                </div>
                <div>
                    <Serial getCurrentCode={getCurrentCode} exportConsole={pipeOutputToConsole} />
                </div>
            </div>

            {   editors.filter((editor, index) => {
                    return index === activeIDE;
                }).map((editor) => {
                    return (
                        <IDE key={editor.id} id={editor.id} content={consoleOutput} code={editor.code} onEdit={editCurrentFile}/>
                    )
                }) 
            }
        </div>
    );
}


export default App;