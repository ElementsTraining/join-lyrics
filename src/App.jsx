import { useMemo, useState } from 'react';
import LanguageField from './components/LanguageField';
import { getMessage, languages } from './i18n';

const BASE_LANGUAGE_KEYS = ['pt', 'de', 'en'];
const INITIAL_EXTRA_LANGUAGES = [];

function splitStanzas(text) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildAlignedText(languages, orderedCodes) {
  const stanzaCount = Math.max(...orderedCodes.map((code) => splitStanzas(languages[code] ?? '').length), 0);
  const blocks = [];

  for (let index = 0; index < stanzaCount; index += 1) {
    let block = '';

    orderedCodes.forEach((code, languageIndex) => {
      const stanzas = splitStanzas(languages[code] ?? '');
      const stanza = stanzas[index] ?? '';
      block += stanza;

      if (languageIndex < orderedCodes.length - 1) {
        block += '\n \n';
      } else {
        block += '\n\n';
      }
    });

    blocks.push(block);
  }

  return blocks.join('').trim();
}

function buildStanzaPreview(languages, orderedCodes) {
  const stanzaCount = Math.max(...orderedCodes.map((code) => splitStanzas(languages[code] ?? '').length), 0);
  const stanzas = [];

  for (let index = 0; index < stanzaCount; index += 1) {
    const stanzaLines = orderedCodes.map((code) => ({
      code,
      text: splitStanzas(languages[code] ?? '')[index] ?? '',
    }));

    stanzas.push({
      id: index + 1,
      lines: stanzaLines,
    });
  }

  return stanzas;
}

function getInitialLocale() {
  const browserLocale = navigator.language?.toLowerCase() ?? '';

  if (browserLocale.startsWith('pt')) {
    return 'pt';
  }

  if (browserLocale.startsWith('de')) {
    return 'de';
  }

  return 'en';
}

function App() {
  const [locale, setLocale] = useState(getInitialLocale);
  const [title, setTitle] = useState('Oceans');
  const [baseLanguages, setBaseLanguages] = useState(
    BASE_LANGUAGE_KEYS.reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
  );
  const [extraLanguages, setExtraLanguages] = useState(
    INITIAL_EXTRA_LANGUAGES.reduce((acc, language) => ({ ...acc, [language.key]: '' }), {}),
  );
  const [extraLanguageName, setExtraLanguageName] = useState('');
  const [extraLanguageCode, setExtraLanguageCode] = useState('');
  const [copied, setCopied] = useState(false);

  const t = (key) => getMessage(locale, key);

  const baseLanguageMeta = useMemo(
    () => [
      { key: 'pt', label: t('baseLanguagePtLabel'), placeholder: t('baseLanguagePtPlaceholder') },
      { key: 'de', label: t('baseLanguageDeLabel'), placeholder: t('baseLanguageDePlaceholder') },
      { key: 'en', label: t('baseLanguageEnLabel'), placeholder: t('baseLanguageEnPlaceholder') },
    ],
    [locale],
  );

  const allLanguages = useMemo(() => ({ ...baseLanguages, ...extraLanguages }), [baseLanguages, extraLanguages]);
  const orderedCodes = useMemo(() => {
    const codes = ['pt', 'de', 'en', ...Object.keys(extraLanguages)];
    return codes.filter((code, index) => codes.indexOf(code) === index);
  }, [extraLanguages]);

  const alignedText = useMemo(() => buildAlignedText(allLanguages, orderedCodes), [allLanguages, orderedCodes]);
  const stanzaPreview = useMemo(() => buildStanzaPreview(allLanguages, orderedCodes), [allLanguages, orderedCodes]);
  const stanzaMismatch = useMemo(() => {
    const languageCounts = orderedCodes.map((code) => splitStanzas(allLanguages[code] ?? '').length);
    return languageCounts.some((count) => count !== languageCounts[0]) && languageCounts.some((count) => count > 0);
  }, [allLanguages, orderedCodes]);

  const updateLanguage = (key, value) => {
    if (BASE_LANGUAGE_KEYS.includes(key)) {
      setBaseLanguages((current) => ({ ...current, [key]: value }));
      return;
    }

    setExtraLanguages((current) => ({ ...current, [key]: value }));
  };

  const addExtraLanguage = () => {
    const code = extraLanguageCode.trim().toLowerCase();
    const label = extraLanguageName.trim();

    if (!code || !label) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(allLanguages, code)) {
      return;
    }

    setExtraLanguages((current) => ({ ...current, [code]: '' }));
    setExtraLanguageCode('');
    setExtraLanguageName('');
  };

  const handleDownload = () => {
    const blob = new Blob([alignedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'lyrics'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!alignedText) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(alignedText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = alignedText;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>{t('appTitle')}</h1>
        <p>{t('appDescription')}</p>
      </header>

      <section className="panel">
        <div className="toolbar">
          <div className="input-group" style={{ minWidth: 220 }}>
            <label htmlFor="locale">{t('interfaceLanguage')}</label>
            <select id="locale" value={locale} onChange={(event) => setLocale(event.target.value)}>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ minWidth: 220 }}>
            <label htmlFor="title">{t('songTitle')}</label>
            <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('songTitlePlaceholder')} />
          </div>
          <button className="button" onClick={handleDownload}>{t('downloadButton')}</button>
          <button className="button secondary" onClick={handleCopy}>{copied ? t('copySuccess') : t('copyButton')}</button>
          <button className="button secondary" onClick={() => window.location.reload()}>{t('resetButton')}</button>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="extra-code">{t('extraCodeLabel')}</label>
            <input id="extra-code" value={extraLanguageCode} onChange={(event) => setExtraLanguageCode(event.target.value)} placeholder={t('extraCodePlaceholder')} />
          </div>
          <div className="input-group" style={{ minWidth: 240 }}>
            <label htmlFor="extra-name">{t('extraNameLabel')}</label>
            <input id="extra-name" value={extraLanguageName} onChange={(event) => setExtraLanguageName(event.target.value)} placeholder={t('extraNamePlaceholder')} />
          </div>
          <button className="button secondary" onClick={addExtraLanguage}>{t('addLanguageButton')}</button>
        </div>

        <div className="language-grid">
          {baseLanguageMeta.map((language) => (
            <LanguageField
              key={language.key}
              label={language.label}
              value={baseLanguages[language.key]}
              code={language.key}
              placeholder={language.placeholder}
              onChange={updateLanguage}
              isBase
              hint={t('baseLanguageHint')}
            />
          ))}

          {Object.entries(extraLanguages).map(([code, value]) => {
            const meta = { label: code, placeholder: t('extraLanguagePlaceholder') };
            return (
              <LanguageField
                key={code}
                label={meta.label}
                value={value}
                code={code}
                placeholder={meta.placeholder}
                onChange={updateLanguage}
                hint={t('extraLanguageHint')}
              />
            );
          })}
        </div>

        {stanzaMismatch && (
          <div className="warning-banner">
            {t('stanzaMismatchWarning')}
          </div>
        )}

        <div className="helper">{t('helperText')}</div>

        <h3 style={{ marginBottom: 10 }}>{t('previewTitle')}</h3>
        <div className="output-preview">{alignedText || t('emptyPreview')}</div>

        <h3 style={{ margin: '18px 0 10px' }}>{t('projectionPreviewTitle')}</h3>
        <div className="projection-preview" aria-label="projection preview">
          {stanzaPreview.length === 0 ? (
            <div className="projection-empty">{t('emptyPreview')}</div>
          ) : (
            stanzaPreview.map((stanza) => (
              <div className="projection-card" key={stanza.id}>
                <div className="projection-card-title">Stanza {stanza.id}</div>
                <div className="projection-card-body">
                  {stanza.lines.map((line) => (
                    <div className="projection-line" key={`${stanza.id}-${line.code}`}>
                      <span className="projection-code">{line.code.toUpperCase()}</span>
                      <span className="projection-text">{line.text || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
