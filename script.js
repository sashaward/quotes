document.addEventListener('DOMContentLoaded', function () {
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  const buttons = document.querySelectorAll('.button');
  const apiKey = 'fZhEaGwYKY/O8UA6CnsFfw==RV2IVL0tAMCoXQtk'; // Replace with your actual API key

  // v2 category names (see https://api-ninjas.com/api/quotes); UI still uses data-category="funny"
  const categoryForApi = {
    funny: 'humor'
  };

  function fetchQuote(category) {
    quoteElement.textContent = 'Loading...';
    authorElement.textContent = '';

    const apiCategory = categoryForApi[category] || category;
    const url = `https://api.api-ninjas.com/v2/randomquotes?categories=${encodeURIComponent(apiCategory)}`;

    fetch(url, {
      headers: {
        'X-Api-Key': apiKey
      }
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const message =
            data && typeof data.error === 'string' ? data.error : `Request failed (${response.status})`;
          throw new Error(message);
        }
        if (!Array.isArray(data) || !data[0] || typeof data[0].quote !== 'string') {
          throw new Error('No quote in response');
        }
        return data[0];
      })
      .then(item => {
        quoteElement.textContent = item.quote;
        authorElement.textContent = item.author ? `– ${item.author}` : '';
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
        quoteElement.textContent = "Couldn't load a quote.";
        authorElement.textContent =
          error.message === 'Invalid API Key.'
            ? 'Add a valid API Ninjas key in script.js (free at api-ninjas.com).'
            : 'Try again in a moment.';
      });
  }

  // Default quote load (Inspire me)
  fetchQuote('inspirational');

  // Attach click event listeners to each button with the correct category
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      fetchQuote(category);
    });
  });

  // Tooltip and copy-to-clipboard functionality on the h1 element
  quoteElement.addEventListener('mouseenter', () => {
    quoteElement.setAttribute('data-tooltip', 'Copy');
  });

  quoteElement.addEventListener('click', () => {
    const quoteText = quoteElement.textContent;
    navigator.clipboard.writeText(quoteText).then(() => {
      quoteElement.setAttribute('data-tooltip', 'Copied!');
      setTimeout(() => {
        quoteElement.setAttribute('data-tooltip', 'Copy');
      }, 2000);
    });
  });

  // Keyboard shortcut functionality
  document.addEventListener('keydown', event => {
    const keyMap = {
      1: 'inspirational', // '1' triggers "Inspire"
      2: 'success',       // '2' triggers "Motivate"
      3: 'funny',         // '3' triggers "Laugh"
      4: 'happiness'      // '4' triggers "Smile"
    };

    const category = keyMap[event.key.toLowerCase()];
    if (category) {
      fetchQuote(category);
      // Optional: add a visual effect (like focus) to the corresponding button
      const button = document.querySelector(`.button[data-category="${category}"]`);
      if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200); // Temporary highlight effect
      }
    }
  });
});
