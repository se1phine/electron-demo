import { ChangeEvent, useEffect, useRef } from 'react';
import { IpcRendererEvent } from 'electron';

import { HtmlEntity } from '../electron/lib/html.ts';

import { useStateWithRef } from './hooks.ts';

function App() {
  const [fetchUrl, setFetchUrl, urlRef] = useStateWithRef<string>('https://www.shanghai.gov.cn/');
  const rawHtmlRef = useRef<string>('');
  // forms
  const [title, setTitle, titleRef] = useStateWithRef('');
  const [seoMetas, setSeoMetas, seoMetasRef] = useStateWithRef<Record<string, string>[]>([]);

  useEffect(() => {
    window.ipcRenderer.on('fetch-reply', (_event: IpcRendererEvent, ht: HtmlEntity) => {
      setTitle(ht.title);
      setSeoMetas(ht.seoMetas);
      rawHtmlRef.current = ht.rawHtml;
    });
    window.ipcRenderer.on('save-reply', (_event: IpcRendererEvent, arg: string) => {
      alert('save success, file path: ' + arg);
    });
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFetchUrl(e.target.value);
  };

  const handleFetch = () => {
    window.ipcRenderer.send('fetch', urlRef.current);
  };

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    window.ipcRenderer.send('save', {
      title: titleRef.current,
      seoMetas: seoMetasRef.current,
      rawHtml: rawHtmlRef.current,
    });
  };

  return (
    <div className='container'>
      <div>
        <label htmlFor='fetchUrl'>Fetch URL: </label>
        <input id='fetchUrl' type='text' value={fetchUrl} onInput={handleInput} />
        <button onClick={handleFetch}>Fetch</button>
        {title ? <button onClick={handleSave}>save modified html to local</button> : null}
      </div>
      {title ? (
        <div className='row flex'>
          <label>
            Title:
            <input type='text' value={title} onInput={handleTitle} />
          </label>
        </div>
      ) : null}
      {seoMetas.map((meta, i) => (
        <div key={i} className='row flex'>
          <label>
            {meta.name}:
            <input
              type='text'
              value={meta.content}
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                const newMeta = [...seoMetas];
                newMeta[i] = { name: meta.name, content: e.target.value };
                setSeoMetas(newMeta);
              }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default App;
