document.addEventListener('DOMContentLoaded', function() {
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  const buttons = document.querySelectorAll('.button');
  const apiKey = 'fZhEaGwYKY/O8UA6CnsFfw==RV2IVL0tAMCoXQtk'; // Replace with your actual API key

  // Function to fetch and display quotes based on category
  function fetchQuote(category) {
    quoteElement.textContent = 'Loading...'; // Show loading text
    authorElement.textContent = '';

    fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
      headers: {
        'X-Api-Key': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      const quoteText = data[0].quote;
      const quoteAuthor = data[0].author;

      // Display the quote and author
      quoteElement.textContent = quoteText;
      authorElement.textContent = `– ${quoteAuthor}`;
    })
    .catch(error => console.error('Error fetching quote:', error));
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

  // Tooltip and copy to clipboard functionality on the h1 element
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
});
