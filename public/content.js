function getPageText() {
  const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li");
  let text = "";
  elements.forEach(el => {
    text += el.innerText + " ";
  });
  return text.trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PAGE_TEXT") {
    sendResponse({ text: getPageText() });
  }
});
