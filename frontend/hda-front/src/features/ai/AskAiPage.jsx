import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import aiApi from '../../api/aiApi';

export default function AskAiPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const canAsk = question.trim().length > 5 && !loading;

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

  return (
    <div className="ask-ai">
      <h1>Ask AI about Insurance</h1>
      <p className="muted">Powered by Gemini with the local glossary as context.</p>

      <form onSubmit={onSubmit} className="ask-form" style={{ maxWidth: 800 }}>
        <label htmlFor="question">Your question</label>
        <textarea
          id="question"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What is the difference between comprehensive and third-party insurance?"
          required
          style={{ width: '100%', marginBottom: 12 }}
        />

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <button type="submit" disabled={!canAsk}>
            {loading ? 'Asking…' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error" style={{ color: '#a00', marginTop: 12 }}>{error}</div>
      )}

      {response && (
        <div className="ai-answer" style={{ marginTop: 16 }}>
          {response.answer ? (
            <>
              <h2>Answer</h2>
              <div className="markdown-body" style={{ lineHeight: 1.6 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    )
                  }}
                >
                  {response.answer}
                </ReactMarkdown>
              </div>
            </>
          ) : null}

          {response.sources && Array.isArray(response.sources) && response.sources.length > 0 && (
            <div style={{ marginTop: 16 }}>
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

          {!response.answer && (
            <>
              <h2>Response</h2>
              <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto' }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
