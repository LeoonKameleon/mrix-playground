import { Editor, useMonaco } from "@monaco-editor/react";
import { useState, useEffect, useContext } from "react";
import { registerMrixLanguage } from "../MrixLanguage";
import { AuthContext } from "../auth/AuthContext";
import { LoginForm } from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import "../styles/styles.css";

export default function CodeEditor() {
    const [code, setCode] = useState("// Write your mrix code here\n");
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const { token, login, logout, isLoggedIn, user } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
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
                headers: { 
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({ code }),
            });
            if (res.status === 429) {
                setOutput({ 
                    output: `API rate limit exceeded. Please wait a moment before running code again.`, 
                    status: 429,
                    execution_time: 0
                });
                return;
            }
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
                <div className="run-section">
                    <div>
                    Mrix Playground
                    </div>
                    <button
                        className="runButton"
                        onClick={handleRun}
                        disabled={loading}
                    >
                        {loading ? "Running..." : "Run"}
                    </button>
                </div>
                <div className="auth-section">
                    {isLoggedIn ? (
                        <>
                            <span className="user-welcome">
                                Welcome, <strong>{user?.username}</strong>
                            </span>
                            <button onClick={logout} className="btn-logout">
                                Log Out
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} className="btn-login">
                            Log in / Register
                        </button>
                    )}
                </div>
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
                                    {(output.execution_time ?? 0).toFixed(3)}s
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
            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowAuthModal(false)}>×</button>
                        
                        {isLoginView ? (
                            <>
                                <h2>Log in</h2>
                                <LoginForm onLoginSuccess={() => setShowAuthModal(false)} />
                                <p className="switch-text">
                                    Don't have an account? <span onClick={() => setIsLoginView(false)}>Register</span>
                                </p>
                            </>
                        ) : (
                            <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}