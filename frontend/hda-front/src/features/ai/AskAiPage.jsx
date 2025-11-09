import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import aiApi from '../../api/aiApi';

function SparkleIcon({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l2.2 5.4L20 9.6l-5.1 3.2L13.6 20 12 15 10.4 20l-1.3-7.2L4 9.6l5.8-2.2L12 2z" fill="currentColor"/>
    </svg>
  );
}

function SendIcon({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" fill="currentColor"/>
    </svg>
  );
}

export default function AskAiPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const canAsk = question.trim().length > 5 && !loading;
  const asked = !!response;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canAsk) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const resp = await aiApi.ask({ question: question.trim() });
      setResponse(resp);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setQuestion('');
    setResponse(null);
    setError(null);
  }

  return (
    <div className="ai-page">
      <div className="ai-container">
        <header className="ai-header animate-fade-in">
          <h1 className="ai-title">Ask AI</h1>
          <p className="ai-subtitle">Get an answer to your question</p>
        </header>

        <main className="ai-card">
          <div className="ai-card-body">
            {!asked ? (
              <form onSubmit={onSubmit} className="ai-form">
                <div className="ai-field">
                  <label htmlFor="question" className="ai-label">What would you like to know?</label>
                  <textarea
                    id="question"
                    rows={6}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything about insurance..."
                    disabled={loading}
                    className="ai-textarea"
                    inputMode="text"
                    enterKeyHint="send"
                  />
                </div>

                <button type="submit" disabled={!canAsk} className="btn btn-primary">
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <SendIcon className="btn-icon" />
                      Ask Question
                    </>
                  )}
                </button>

                {error && (
                  <div className="ai-error" role="alert">{error}</div>
                )}
              </form>
            ) : (
              <div className="ai-result">
                <div className="ai-question">
                  <p className="ai-question-label">Your Question</p>
                  <p className="ai-question-text">{question}</p>
                </div>

                <div className="ai-answer">
                  <p className="ai-answer-label">Answer</p>
                  <div className="ai-answer-box">
                    {response?.answer ? (
                      <div className="markdown-body">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a {...props} target="_blank" rel="noopener noreferrer">{props.children}</a>
                            )
                          }}
                        >
                          {response.answer}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="ai-pre">{JSON.stringify(response, null, 2)}</pre>
                    )}
                  </div>

                  {response?.sources && Array.isArray(response.sources) && response.sources.length > 0 && (
                    <div className="ai-sources">
                      <h3>Sources</h3>
                      <ul>
                        {response.sources.map((s, i) => (
                          <li key={i}>
                            {typeof s === 'string' ? s : (s.title || s.id || JSON.stringify(s))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button onClick={onReset} className="btn btn-secondary">
                  <SparkleIcon className="btn-icon" />
                  Ask Another Question
                </button>

                {error && (
                  <div className="ai-error" role="alert">{error}</div>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="ai-footer">Powered by Gemini • One question per session</footer>
      </div>
    </div>
  );
}
