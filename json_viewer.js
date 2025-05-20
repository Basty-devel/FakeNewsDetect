
function formatJSON() {
  const pre = document.querySelector('pre');
  try {
    const rawText = pre.textContent;
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    const jsonText = rawText.slice(jsonStart, jsonEnd + 1);
    const obj = JSON.parse(jsonText);
    pre.innerHTML = '<code>' + JSON.stringify(obj, null, 2) + '</code>';
  } catch (e) {
    console.error("Invalid JSON output");
  }
}
window.onload = formatJSON;
