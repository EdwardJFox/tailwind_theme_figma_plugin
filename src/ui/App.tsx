import { useEffect, useState } from 'react'

type CssMessage = {
  type: 'css';
  css: string;
}

type IncomingMessages = {
  pluginMessage: CssMessage;
}

function App() {
  const [selectedTailwindVersion, setSelectedTailwindVersion] = useState('4');
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [css, setCss] = useState<null | string>(null);

  const handleExportClick = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'export',
        tailwindVersion: selectedTailwindVersion,
        baseFontSize
      }
    }, '*')
  }
  
  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  const handleIncomingMessage = (event: MessageEvent<IncomingMessages>) => {
    if (event.data.pluginMessage.type === 'css') {
      setCss(event.data.pluginMessage.css);
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleIncomingMessage);
    return () => window.removeEventListener("message", handleIncomingMessage);
  }, []);

  return (
    <div className="px-4 pt-2.5 pb-2 bg-background font-atkinson-hyperlegible min-h-full">
      <h1 className="text-title font-title text-text mb-1">Tailwind Theme Export</h1>
      <p className="text-details text-text mb-2">A simple plugin to export your documents Local Styles to a Tailwind 4 CSS theme.</p>
      <label htmlFor="tailwind_version" className="text-label ml-4 text-text mb-3">
        Tailwind Version
      </label>
      <select
        id="tailwind_version"
        disabled
        onChange={(e) => setSelectedTailwindVersion(e.target.value)}
        className="border-2 rounded-lg border-secondary text-text px-4 py-2 w-full mb-3"
      >
        <option value="4">Tailwind 4 - Alpha</option>
      </select>

      <label htmlFor="base_font_size" className="text-label ml-4 text-text mb-3">
        Base font size
      </label>
      <input
        className="border-2 rounded-lg border-secondary text-text px-4 py-2 w-full"
        id="base_font_size"
        value={baseFontSize}
        onChange={(e) => setBaseFontSize(parseInt(e.target.value, 10))}
        type="number"
      />

      <div className="grid grid-cols-2 space-x-4 my-4">
        <button
          onClick={handleExportClick}
          className="border-2 py-2 px-4 border-primary hover:bg-primary-hover text-text text-label rounded-lg"
        >
          Export
        </button>
        <button
          onClick={handleCancelClick}
          className="border-2 py-2 px-4 border-secondary text-text text-label rounded-lg"
        >
          Cancel
        </button>
      </div>

      <pre className="p-1 text-text bg-code-background rounded-lg text-code overflow-hidden">
        <code>
          { css ? css : <h2 className="text-title text-text text-center py-4 font-title font-atkinson-hyperlegible">CSS goes here</h2> }
        </code>
      </pre>

      <p className="text-details text-text my-2">Created by <a className="underline" href="https://twitter.com/icemaz" target="_blank">Edward Fox (icemaz)</a></p>
    </div>
  )
}

export default App
