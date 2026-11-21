import { useEffect, useRef, useState } from 'react'
import { Check, Cpu, Eye, EyeOff, Loader2, ShieldCheck, X, Zap } from 'lucide-react'
import type { LlmConfig } from '../../context/DeskContext'
import PanelHead from './PanelHead'

const PROVIDERS = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o-mini',
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
  {
    name: 'Ollama',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3.2',
  },
]

type TestState = {
  status: 'idle' | 'checking' | 'ok' | 'error'
  message: string
}

function validateLlm(llm: LlmConfig): string | null {
  if (!llm.baseUrl.trim()) return 'Add a base URL first.'
  try {
    const url = new URL(llm.baseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Use an http:// or https:// endpoint.'
    }
  } catch {
    return 'That base URL does not look valid.'
  }
  if (!llm.model.trim()) return 'Add a model name.'
  if (!llm.apiKey.trim()) return 'Add an API key to validate.'
  return null
}

export default function AiEnginePanel({
  llm,
  onChange,
}: {
  llm: LlmConfig
  onChange: (patch: Partial<LlmConfig>) => void
}) {
  const [showKey, setShowKey] = useState(false)
  const [testState, setTestState] = useState<TestState>({
    status: 'idle',
    message: '',
  })
  const testTimer = useRef<number | null>(null)
  const keyReady = llm.apiKey.trim().length > 0

  useEffect(() => {
    if (testTimer.current) {
      window.clearTimeout(testTimer.current)
      testTimer.current = null
    }
    setTestState({ status: 'idle', message: '' })
  }, [llm.baseUrl, llm.model, llm.apiKey])

  useEffect(
    () => () => {
      if (testTimer.current) window.clearTimeout(testTimer.current)
    },
    [],
  )

  function testConnection() {
    if (testState.status === 'checking') return
    const error = validateLlm(llm)
    if (error) {
      setTestState({ status: 'error', message: error })
      return
    }

    setTestState({ status: 'checking', message: 'Checking your config…' })
    testTimer.current = window.setTimeout(() => {
      setTestState({ status: 'ok', message: 'Config looks valid.' })
      testTimer.current = null
    }, 900)
  }

  return (
    <section className="panel" id="ai-engine">
      <PanelHead
        icon={<Cpu size={16} />}
        title="AI engine"
        description="Any OpenAI-compatible endpoint."
        aside={
          <span className={`mini-status${keyReady ? ' ok' : ''}`}>
            {keyReady ? 'CONFIGURED' : 'KEY NEEDED'}
          </span>
        }
      />

      <div className="provider-row">
        <span className="provider-label">Presets</span>
        <div className="provider-chips">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.name}
              type="button"
              className={`provider-chip${
                llm.baseUrl === provider.baseUrl ? ' is-active' : ''
              }`}
              onClick={() =>
                onChange({ baseUrl: provider.baseUrl, model: provider.model })
              }
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="llm-base-url">Base URL</label>
        <input
          id="llm-base-url"
          value={llm.baseUrl}
          onChange={(event) => onChange({ baseUrl: event.target.value })}
          placeholder="https://api.openai.com/v1"
          autoCapitalize="none"
          spellCheck={false}
          inputMode="url"
        />
        <span className="field-hint">
          OpenAI, OpenRouter, Groq, and local Ollama all work.
        </span>
      </div>

      <div className="form-grid form-grid--engine">
        <div className="field">
          <label htmlFor="llm-model">Model name</label>
          <input
            id="llm-model"
            value={llm.model}
            onChange={(event) => onChange({ model: event.target.value })}
            placeholder="gpt-4o-mini"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <div className="field">
          <label htmlFor="llm-api-key">API key</label>
          <div className="input-wrap">
            <input
              id="llm-api-key"
              type={showKey ? 'text' : 'password'}
              value={llm.apiKey}
              onChange={(event) => onChange({ apiKey: event.target.value })}
              placeholder="sk-…"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowKey((visible) => !visible)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <span className="field-hint">Stored in this browser only.</span>
        </div>
      </div>

      <div className="security-note">
        <ShieldCheck size={15} />
        <span>
          Your key is saved to this browser&apos;s local storage. It is only sent
          to the endpoint you configure above — never to TRAX.
        </span>
      </div>

      <div className="test-row">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={testConnection}
          disabled={testState.status === 'checking'}
        >
          {testState.status === 'checking' ? (
            <Loader2 className="spin" size={14} />
          ) : (
            <Zap size={14} />
          )}
          {testState.status === 'checking' ? 'Validating…' : 'Validate config'}
        </button>

        {testState.status !== 'idle' && (
          <span
            className={`test-status test-status--${testState.status}`}
            role="status"
          >
            {testState.status === 'checking' ? (
              <Loader2 className="spin" size={13} />
            ) : testState.status === 'ok' ? (
              <Check size={13} />
            ) : (
              <X size={13} />
            )}
            {testState.message}
          </span>
        )}
      </div>

      <p className="field-hint">
        Validation happens locally. Your analysis service calls this endpoint when
        a sweep runs.
      </p>
    </section>
  )
}
