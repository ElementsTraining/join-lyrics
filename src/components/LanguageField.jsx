function LanguageField({ label, value, code, placeholder, onChange, isBase = false, hint }) {
  const lines = value.split('\n');
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, index) => index + 1);

  return (
    <div className="language-card">
      <div className="language-meta">
        <strong>{label}</strong>
        <span>{hint ?? (isBase ? 'Base language · fixed order' : code)}</span>
      </div>

      <div className="editor-shell">
        <div className="line-numbers" aria-hidden="true">
          {lineNumbers.map((number) => (
            <span key={number}>{number}</span>
          ))}
        </div>
        <textarea
          aria-label={label}
          value={value}
          onChange={(event) => onChange(code, event.target.value)}
          placeholder={placeholder}
          rows={10}
        />
      </div>
    </div>
  );
}

export default LanguageField;
