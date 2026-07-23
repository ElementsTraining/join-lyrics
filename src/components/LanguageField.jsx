import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

function LanguageField({ label, value, code, placeholder, onChange, isBase = false, hint }) {
  return (
    <div className="language-card">
      <div className="language-meta">
        <strong>{label}</strong>
        <span>{hint ?? (isBase ? 'Base language · fixed order' : code)}</span>
      </div>

      <div className="editor-shell">
        <textarea
          aria-label={label}
          value={value}
          onChange={(event) => onChange(code, event.target.value)}
          placeholder={placeholder}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <CodeMirror
          value={value}
          height="240px"
          placeholder={placeholder}
          extensions={[basicSetup, EditorView.lineWrapping]}
          onChange={(nextValue) => onChange(code, nextValue)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            autocompletion: false,
            foldGutter: false,
            drawSelection: true,
          }}
          className="language-editor"
        />
      </div>
    </div>
  );
}

export default LanguageField;
