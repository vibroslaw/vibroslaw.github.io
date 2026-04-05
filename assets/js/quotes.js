const quoteElement = document.getElementById("memoryQuoteText");

function getQuotesFromBodyData() {
  const rawQuotes = document.body.dataset.quotes;

  if (!rawQuotes) return [];

  try {
    const parsedQuotes = JSON.parse(rawQuotes);

    if (!Array.isArray(parsedQuotes)) return [];

    return parsedQuotes.filter(
      (quote) => typeof quote === "string" && quote.trim().length > 0
    );
  } catch (error) {
    return [];
  }
}

function getDailyQuoteIndex(quotesLength) {
  if (!quotesLength) return 0;

  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return dayOfYear % quotesLength;
}

function applyDailyQuote() {
  if (!quoteElement) return;

  const quotes = getQuotesFromBodyData();
  if (!quotes.length) return;

  const quoteIndex = getDailyQuoteIndex(quotes.length);
  const selectedQuote = quotes[quoteIndex];

  quoteElement.textContent = selectedQuote;
  quoteElement.setAttribute("data-quote-index", String(quoteIndex));
}

applyDailyQuote();
