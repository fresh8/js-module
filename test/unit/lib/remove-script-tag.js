export function removeScriptTag (src) {
  const scriptTags = window.document.getElementsByTagName('script');

  for (var i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].src === src) {
      scriptTags[i].parentNode.removeChild(scriptTags[i]);
    }
  }
}
