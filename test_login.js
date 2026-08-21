const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push('PAGE ERROR: ' + error.message);
  });

  console.log("Navigating to login page...");
  await page.goto('http://localhost:3000/?manage=true', { waitUntil: 'networkidle2' });
  
  // Fill the login form
  console.log("Logging in...");
  await page.type('input[type="text"]', 'elgazar');
  await page.type('input[type="password"]', 'Gz9823_Elgazar_Pass2026');
  await page.click('button[type="submit"]');

  console.log("Waiting for Dashboard to load...");
  await new Promise(r => setTimeout(r, 3000)); // wait for transition

  if (errors.length > 0) {
    console.log("ERRORS CAUGHT:");
    console.log(errors.join('\n'));
  } else {
    console.log("NO ERRORS FOUND! Page loaded successfully.");
    const html = await page.content();
    if (html.includes('AdminProductModal')) {
      console.log("AdminProductModal is in the DOM (though maybe minified).");
    }
  }

  await browser.close();
})();
