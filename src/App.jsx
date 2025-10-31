import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { summarizeText } from './api/summarizer'

function App() {
  const [summary, setSummary] = useState([])
  const [message, setMessage] = useState("");

  useEffect(()=>{
    chrome.storage.local.get("selection",(data)=>{
      if(data.selection){
        setSummary([data.selection]);
      }
    });
  },[])

  // Save summary to local storage
  function saveSummary() {
    chrome.storage.local.get("savedSummaries",(data)=>{
      const savedSummaries=data.savedSummaries || [];
      const newSummaries=[...savedSummaries,...summary];
      chrome.storage.local.set({savedSummaries:newSummaries},()=>{
        setMessage("Summary saved");
        setTimeout(() => setMessage(""), 2000);
      })
    })
  }

  // Copy summary to clipboard
  function copySummary() {
    navigator.clipboard.writeText(summary)
    alert('Summary copied to clipboard!')
  }

  function exportSummaries() {
  chrome.storage.local.get("savedSummaries", (data) => {
    const summaries = data.savedSummaries || [];
    const blob = new Blob([summaries.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summaries.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
}


  return (
    <>
      <div className='popup-container'>
        <header>
           <h1>QuickDigest</h1>
        </header>
        <h2>Highlighted Text Summary</h2>
        <p>{summary}</p>
        <footer>
          <button onClick={copySummary}>Copy</button>
          <button onClick={saveSummary}>Save</button>
          <button onClick={exportSummaries}>Export</button>
        </footer>
        {message && <div className="toast">{message}</div>}
      </div>
    </>
  )
}

export default App
