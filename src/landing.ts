/**
 * Landing page for the builder.
 * Kept as a separate module so index.ts stays readable and the HTML
 * is not buried inside the request handler.
 */

export function landingPage(skinOptions: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mini-LLM Builder</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0a0a;
      --surface: #141414;
      --border: #2a2a2a;
      --text: #f5f5f5;
      --muted: #8a8a8a;
      --accent: #e8c07a;
      --error: #ff8a8a;
      --ok: #8fdd8f;
    }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 3rem 1.5rem;
      line-height: 1.5;
    }
    main { max-width: 760px; margin: 0 auto; }
    h1 { font-size: clamp(1.9rem, 4vw, 2.75rem); letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    p.sub { color: var(--muted); margin-bottom: 2.5rem; font-size: 1rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 620px) { .grid { grid-template-columns: 1fr; } }
    .field { margin-bottom: 1.25rem; }
    label {
      display: block; margin-bottom: 0.4rem;
      font-size: 0.8rem; font-weight: 600;
      letter-spacing: 0.04em; text-transform: uppercase;
      color: var(--accent);
    }
    input, textarea, select {
      width: 100%; padding: 0.7rem 0.8rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: inherit; font-size: 0.95rem;
    }
    input:focus, textarea:focus, select:focus {
      outline: none; border-color: var(--accent);
    }
    textarea { min-height: 110px; resize: vertical; }
    button {
      padding: 0.8rem 1.75rem;
      background: var(--accent); color: #0a0a0a;
      border: none; border-radius: 8px;
      font-size: 0.95rem; font-weight: 700;
      cursor: pointer;
    }
    button:hover:not(:disabled) { filter: brightness(1.08); }
    button:disabled { background: #3a3a3a; color: #777; cursor: not-allowed; }
    #status { margin: 1.25rem 0; padding: 0.75rem 1rem; border-radius: 8px; display: none; font-size: 0.9rem; }
    #status.show { display: block; }
    #status.loading { background: #16261a; color: var(--ok); }
    #status.error { background: #2a1616; color: var(--error); white-space: pre-wrap; }
    #output {
      margin-top: 1.5rem; padding: 1.25rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      white-space: pre-wrap; word-break: break-word;
      font-family: ui-monospace, monospace; font-size: 0.8rem;
      line-height: 1.6; max-height: 70vh; overflow-y: auto;
      display: none;
    }
    #output.show { display: block; }
    .actions { margin-top: 1rem; display: flex; gap: 0.6rem; }
    .actions button {
      padding: 0.45rem 0.9rem; font-size: 0.8rem;
      background: transparent; color: var(--text);
      border: 1px solid var(--border);
    }
    .actions button:hover { border-color: var(--accent); color: var(--accent); }
  </style>
</head>
<body>
  <main>
    <h1>Mini-LLM Builder</h1>
    <p class="sub">Business name and what they do. Pick a skin. Generate.</p>

    <form id="form">
      <div class="grid">
        <div class="field">
          <label for="businessName">Business Name</label>
          <input type="text" id="businessName" placeholder="Smitty's Bar-n-Grill" required>
        </div>
        <div class="field">
          <label for="businessModel">What They Do</label>
          <input type="text" id="businessModel" placeholder="Freshest Friday catch local catfish fry" required>
        </div>
      </div>

      <div class="grid">
        <div class="field">
          <label for="skinId">Design Skin</label>
          <select id="skinId">
            <option value="">(first available)</option>
            ${skinOptions}
          </select>
        </div>
        <div class="field">
          <label for="extra">Extra Direction</label>
          <input type="text" id="extra" placeholder="warm, cinematic, oversized type">
        </div>
      </div>

      <div class="field">
        <label for="businessBrief">Business Brief</label>
        <textarea id="businessBrief" placeholder="Leave blank for an auto-generated first version. Add real prices, reviews, contact info if you have them."></textarea>
      </div>

      <button type="submit" id="submitBtn">Generate Website</button>
    </form>

    <div id="status"></div>
    <div id="output"></div>
    <div class="actions" id="actions" style="display:none">
      <button type="button" id="copyBtn">Copy</button>
      <button type="button" id="downloadBtn">Download .txt</button>
    </div>
  </main>

  <script>
    var form = document.getElementById('form');
    var statusEl = document.getElementById('status');
    var output = document.getElementById('output');
    var submitBtn = document.getElementById('submitBtn');
    var actions = document.getElementById('actions');

    function val(id) { return document.getElementById(id).value; }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      statusEl.className = 'show loading';
      statusEl.textContent = 'Generating. This can take 15-30 seconds.';
      output.className = '';
      output.textContent = '';
      actions.style.display = 'none';

      var payload = {
        businessName: val('businessName'),
        businessModel: val('businessModel'),
        extra: val('extra'),
        skinId: val('skinId'),
        businessBrief: val('businessBrief')
      };

      try {
        var res = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var text = await res.text();

        if (!res.ok) {
          statusEl.className = 'show error';
          statusEl.textContent = 'Error (' + res.status + '): ' + text;
        } else {
          // Navigate to the generated page instead of printing its source.
          document.open();
          document.write(text);
          document.close();
        }
      } catch (err) {
        statusEl.className = 'show error';
        statusEl.textContent = 'Request failed: ' + (err && err.message ? err.message : String(err));
      } finally {
        submitBtn.disabled = false;
      }
    });

    document.getElementById('copyBtn').addEventListener('click', function () {
      navigator.clipboard.writeText(output.textContent);
    });

    document.getElementById('downloadBtn').addEventListener('click', function () {
      var blob = new Blob([output.textContent], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'generated-site.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  </script>
</body>
</html>`;
}
