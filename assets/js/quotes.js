const quoteElement = document.getElementById("memoryQuoteText");

if (quoteElement) {
  try {
    const quotes = JSON.parse(document.body.dataset.quotes || "[]");
    if (quotes.length) {
      const quoteIndex = new Date().getDate() % quotes.length;
      quoteElement.textContent = quotes[quoteIndex];
    }
  } catch (e) {}
}
