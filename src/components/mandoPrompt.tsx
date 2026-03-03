import { useRef, useState } from "react";
import { Loader2, AlertCircle, Trash2, Zap } from "lucide-react";
import type { ResponseItem } from "../models/responseItem";
import { Toaster, toast } from "sonner";
import { generate } from "../services/talkTomandoAPI";
import SkeletonLoading from "../UI/skeletonLoader/skeletonLoading";

function MandoPrompt() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ResponseItem[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  async function handleSubmit() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Please enter a prompt before submitting.");
      return;
    }
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError("");
    setResponse("");

    const result = await generate(trimmed, { signal: controller.signal });

    if (!result.ok && result.error === "__CANCELLED__") {
      setIsLoading(false);
      if (controllerRef.current === controller) controllerRef.current = null;
      return;
    }

    if (!result.ok) {
      setIsLoading(false);
      setError(result.error);

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          prompt: trimmed,
          response: result.error,
          timestamp: Date.now(),
        },
        ...prev,
      ]);

      if (controllerRef.current === controller) controllerRef.current = null;
      return;
    }

    setResponse(result.data);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        prompt: trimmed,
        response: result.data,
        timestamp: Date.now(),
      },
      ...prev,
    ]);

    setIsLoading(false);
    if (controllerRef.current === controller) controllerRef.current = null;
  }

  function toggleHistoryItem(item: ResponseItem) {
    setPrompt(item.prompt);
    setResponse(item.response);
    setError("");
    setExpandedHistory((prev) => (prev === item.id ? null : item.id));
  }

  function handleClear() {
    setPrompt("");
    setResponse("");
    setError("");
  }

  function handleClearHistory() {
    setHistory([]);
    toast.success("History cleared");
  }

  function handleStop() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsLoading(false);
    setError("Response generation stopped by user.");

    setTimeout(() => {
      setError("");
    }, 3000);
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <main className="container py-4">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: 980 }}>
          <div className="card-body p-3 p-md-4">
            <header className="mb-3">
              <div className="d-flex align-items-center gap-2">
                <Zap />
                <h1 className="h4 mb-0">Mando AI</h1>
              </div>
              <p className="text-muted mb-0">
                Enter a prompt and get a response.
              </p>
            </header>

            <div className="row g-4">
              <div className="col-12">
                <div className="mb-3">
                  <textarea
                    data-testid="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    placeholder="Type your prompt…"
                    className="form-control"
                    rows={5}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-12 col-sm-auto d-grid">
                    <button
                      type="button"
                      data-testid="submit-btn"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <span className="d-inline-flex align-items-center gap-2">
                          <Loader2
                            size={18}
                            className="spinner-border spinner-border-sm border-0"
                          />
                          Generating response...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                  <div className="col-12 col-sm-auto d-grid">
                    <button
                      type="button"
                      data-testid="clear-btn"
                      className="btn btn-outline-secondary"
                      onClick={handleClear}
                      disabled={isLoading}
                    >
                      Clear
                    </button>
                  </div>

                  {isLoading && (
                    <div className="col-12 col-sm-auto d-grid">
                      <button
                        type="button"
                        data-testid="stop-btn"
                        className="btn btn-outline-danger"
                        onClick={handleStop}
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center gap-2 mb-3"
                    data-testid="error-alert"
                  >
                    <AlertCircle />
                    <div>{error}</div>
                  </div>
                )}

                <div>
                  <label className="form-label fw-semibold">Response</label>
                  <div
                    className="border rounded-3 p-3 bg-body-tertiary"
                    data-testid="response-display"
                    style={{ minHeight: 140, whiteSpace: "pre-wrap" }}
                  >
                    {isLoading ? (
                      <span className="text-muted fst-italic">
                        <SkeletonLoading />
                        <SkeletonLoading variant="rectangular" />
                        <SkeletonLoading variant="card" />
                      </span>
                    ) : response ? (
                      response
                    ) : (
                      <span className="text-muted">
                        Your response will appear here.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {history.length > 0 && (
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="h5 mb-0">History</h2>
                    <button
                      type="button"
                      data-testid="clear-history-btn"
                      onClick={handleClearHistory}
                      className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Clear
                    </button>
                  </div>

                  <div className="list-group">
                    {history.map((item) => {
                      const open = expandedHistory === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-testid={`history-item-${item.id}`}
                          onClick={() => toggleHistoryItem(item)}
                          className="list-group-item list-group-item-action text-start"
                        >
                          <div className="fw-semibold text-truncate">
                            {item.prompt}
                          </div>

                          <div
                            style={{
                              overflow: "hidden",
                              maxHeight: open ? 220 : 0,
                              transition: "max-height 250ms ease",
                              borderTop: open
                                ? "1px solid #eee"
                                : "1px solid transparent",
                              marginTop: 8,
                            }}
                          >
                            <div
                              style={{
                                padding: open ? 12 : 0,
                                transition: "padding 250ms ease",
                              }}
                            >
                              <div
                                className="text-muted small"
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {item.response}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MandoPrompt;
