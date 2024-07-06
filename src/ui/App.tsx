import { useEffect, useState } from 'react'
import { copyToClipboard } from '../main/copyToClipboard';

type OutputMessage = {
  type: 'output';
  output: string;
  format: 'css' | 'js';
}

type IncomingMessages = {
  pluginMessage: OutputMessage;
}

function App() {
  const [selectedTailwindVersion, setSelectedTailwindVersion] = useState('3');
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [copied, setCopied] = useState(false);
  const [handleNested, setHandleNested] = useState(false);
  const [output, setOutput] = useState<null | string>(null);

  const handleExportClick = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'export',
        tailwindVersion: selectedTailwindVersion,
        baseFontSize,
        handleNested
      }
    }, '*')
  }
  
  const handleCancelClick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  const handleIncomingMessage = (event: MessageEvent<IncomingMessages>) => {
    if (event.data.pluginMessage.type === 'output') {
      setOutput(event.data.pluginMessage.output);
    }
  }

  const handleCopy = () => {
    copyToClipboard(output!);
    setCopied(true);
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
        onChange={(e) => setSelectedTailwindVersion(e.target.value)}
        className="border-2 rounded-lg border-secondary text-text px-4 py-2 w-full mb-3"
      >
        <option value="3">Tailwind 3 - JS</option>
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

      {
        selectedTailwindVersion === '3' ?
        (
          <>
            <label htmlFor="processNested" className="text-text flex items-center gap-x-2">
              <input
                type="checkbox"
                id="processNested"
                checked={handleNested}
                onChange={() => setHandleNested(!handleNested)}
              />
              <span>Process nested colors</span>
            </label>
            <p className="text-sm text-text pt-2 pb-1">Place this content in your tailwind.config.js file, under either theme or theme.extend.</p>
          </>
        )
          :
          <p className="text-sm text-text pt-2 pb-1">Place this content into your index.css file.</p>
      }

      <pre className="text-text bg-code-background rounded-md text-code overflow-hidden p-1.5 relative h-28 overflow-y-auto">
        <code>
          { output ? (
            <>
              <button className="text-text absolute top-2 right-2 hover:bg-white/10 rounded-sm px-2 py-1 z-10" onClick={() => handleCopy()}>{ copied ? 'Copied!' : 'Copy' }</button>
              {output}
            </>
          ) : <h2 className="text-title text-text text-center py-6 font-title font-atkinson-hyperlegible">Config goes here</h2> }
        </code>
      </pre>

      <p className="text-details text-text my-2">Created by <a className="underline" href="https://twitter.com/icemaz" target="_blank">Edward Fox (icemaz)</a></p>
    </div>
  )
}

export default App
