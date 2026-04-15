(function () {
  const counter = new Counter({
    workspace: 'nd-portfolio' 
  });

  async function updateStats() {
    try {
      //  Increment the 'visitorsc' key and get the result
      const result = await counter.up('visitorsc');
      
      const count = result.value || 0;
      const formatted = count.toLocaleString();

      //  Find  HTML elements
      const statEl = document.getElementById('visitor-count');
      const footerEl = document.getElementById('footer-visitors');

      // Update the text
      if (statEl) statEl.textContent = formatted;
      if (footerEl) footerEl.textContent = formatted;

    } catch (err) {
      console.error("CounterAPI Error:", err);
      // Fallback so the UI doesn't look broken
      const statEl = document.getElementById('visitor-count');
      if (statEl) statEl.textContent = '—';
    }
  }

  // Run on page load
  updateStats();
})();