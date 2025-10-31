import { summarizeText } from "../api/summarizer.js";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "quick-digest",
        title: "Summarize with Quick Digest",
        contexts: ["selection","page"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if(info.menuItemId === "quick-digest"){
        if(info.selectionText){
            console.log("summarizing text: " + info.selectionText);
        summarizeText(info.selectionText).then((summary) => {
            console.log("Summary: " + summary);
            chrome.storage.local.set({selection: summary}) ; 

          chrome.windows.create({
            url: chrome.runtime.getURL("index.html?summary=" + encodeURIComponent(summary)),
            type: "popup",
            width: 400,
            height: 300
        });
        }).catch((error) => {
            console.error("Error summarizing text: " + error);
        });
        }else{
           try {
            if (!tab || !tab.id) throw new Error("Invalid tab ID");
        const injectionResult = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li");
            let text = "";
            elements.forEach(el => (text += el.innerText + " "));
            return text.trim();
          },
        });
        const pageText = injectionResult[0].result || "No readable text found";
        console.log("Extracted page text:", injectionResult[0].result);
        summarizeText(pageText ).then((summary) => {
            console.log("Summary: " + summary);
            chrome.storage.local.set({selection: summary}) ; 

          chrome.windows.create({
            url: chrome.runtime.getURL("index.html?summary=" + encodeURIComponent(summary)),
            type: "popup",
            width: 400,
            height: 300
        });
        }).catch((error) => {
            console.error("Error summarizing text: " + error);
        });
      } catch (err) {
        console.error("Error injecting script:", err);
      }
    
        }
        

        

      }

      
});



