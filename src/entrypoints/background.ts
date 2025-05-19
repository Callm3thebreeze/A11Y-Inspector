export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  chrome.action.onClicked.addListener((tab) => {
    // Abrir el panel lateral
    if (tab.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  });
});
