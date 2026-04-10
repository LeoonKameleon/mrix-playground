import { Editor, useMonaco } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { registerMrixLanguage } from "../MrixLanguage";
import "../styles/styles.css";

export default function CodeEditor() {
    const [code, setCode] = useState("// Write your MRIX code here\n");
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) registerMrixLanguage(monaco);
    }, [monaco]);

    async function handleRun() {
        setLoading(true);
        setOutput(null);
        try {
            const res = await fetch("http://localhost:8000/api/execute/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            setOutput(data);
        } catch (err) {
            setOutput({ output: "Server connection error", status: -1 });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app">
            <div className="topbar">
                <div>MRIX Playground</div>

                <button
                    className="runButton"
                    onClick={handleRun}
                    disabled={loading}
                >
                    {loading ? "Running..." : "Run"}
                </button>
            </div>

            <div className="main">
                <div className="editor">
                    <Editor 
                        height="100%"
                        theme="vs-dark"
                        language="mrix"
                        value={code}
                        onChange={setCode}
                        options={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            fontFamily: '"Fira Code", monospace',
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            padding: { top: 16 },
                            automaticLayout: true,
                        }}
                    />
                </div>
                <div className="output">
                    <div className="outputHeader">
                        Output
                    </div>
                    <div className="outputContent">
                        {output ? (
                            <>
                                <pre className={output.status !== 0 ? "error" : ""}>
                                    {output.output}
                                </pre>

                                <div className="muted">
                                    {output.execution_time?.toFixed(3)}s
                                </div>
                            </>
                        ) : (
                            <div className="muted">
                                Output will be visible here...
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}