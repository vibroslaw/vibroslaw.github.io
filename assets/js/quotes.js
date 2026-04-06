const quoteElement = document.getElementById("memoryQuoteText");

function getQuotesFromBodyData() {
  const rawQuotes = document.body.dataset.quotes;

  if (!rawQuotes) return [];

  try {
    const parsedQuotes = JSON.parse(rawQuotes);

    if (!Array.isArray(parsedQuotes)) return [];

    return parsedQuotes
      .filter((quote) => typeof quote === "string")
      .map((quote) => quote.trim())
      .filter((quote) => quote.length > 0);
  } catch (error) {
    return [];
  }
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getDailyQuoteIndex(quotesLength) {
  if (!quotesLength) return 0;

  const dateKey = getLocalDateKey();
  const hash = hashString(dateKey);

  return hash % quotesLength;
}

function applyDailyQuote() {
  if (!quoteElement) return;

  const quotes = getQuotesFromBodyData();
  if (!quotes.length) return;

  const quoteIndex = getDailyQuoteIndex(quotes.length);
  const selectedQuote = quotes[quoteIndex];

  quoteElement.textContent = selectedQuote;
  quoteElement.setAttribute("data-quote-index", String(quoteIndex));
  quoteElement.setAttribute("data-quote-count", String(quotes.length));
  quoteElement.setAttribute("title", selectedQuote);
}

applyDailyQuote();
