// Cursor — desktop only
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        trail.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  } else {
    cursor.style.display = 'none';
    trail.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Skill bars animate
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-cols').forEach(el => skillObserver.observe(el));

  // ── Terminal animation ──────────────────────────────────────────
  const tb = document.getElementById('terminal-body');

  // Each entry: [delay_ms, html_content]
  const lines = [
    [0,    `<span class="t-prompt">➜</span> <span class="t-hl">~/smartseo</span> <span class="t-dim">git:(main)</span>`],
    [300,  `<span class="t-prompt">➜</span> <span class="t-text">mvn spring-boot:run</span>`],
    [700,  `<span class="t-out">  .</span>   <span class="t-hl">____</span>          <span class="t-text">_</span>            <span class="t-hl">__ _ _</span>`],
    [850,  `<span class="t-dim"> /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\</span>`],
    [980,  `<span class="t-dim">( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\</span>`],
    [1100, `<span class="t-dim"> \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )</span>`],
    [1200, `<span class="t-dim">  '  |____| .__|_| |_|_| |_\\__, | / / / /</span>`],
    [1300, `<span class="t-dim"> =========|_|==============|___/=/_/_/_/</span>`],
    [1400, `<span class="t-out"> :: Spring Boot ::              (v3.2.0)</span>`],
    [1650, ``],
    [1700, `<span class="t-dim">INFO</span> <span class="t-text">Initializing virtual threads executor</span>`],
    [1900, `<span class="t-dim">INFO</span> <span class="t-hl">BacklinkScheduler</span> <span class="t-text">— registering cron jobs</span>`],
    [2100, `<span class="t-dim">INFO</span> <span class="t-text">Flyway: applying migration</span> <span class="t-str">V7__domain_score.sql</span>`],
    [2350, `<span class="t-ok">  ✓</span> <span class="t-text">Migration complete</span>`],
    [2550, `<span class="t-dim">INFO</span> <span class="t-text">Connecting to</span> <span class="t-str">redis://localhost:6379</span>`],
    [2750, `<span class="t-ok">  ✓</span> <span class="t-text">Redis connected</span>`],
    [2950, `<span class="t-dim">INFO</span> <span class="t-text">Kafka consumer group</span> <span class="t-str">smartseo-workers</span> <span class="t-text">ready</span>`],
    [3200, `<span class="t-ok">  ✓</span> <span class="t-text">3 partitions assigned</span>`],
    [3400, `<span class="t-dim">INFO</span> <span class="t-text">RabbitMQ exchange</span> <span class="t-str">backlink.events</span> <span class="t-text">declared</span>`],
    [3650, ``],
    [3700, `<span class="t-dim">INFO</span> <span class="t-text">Stripe webhook endpoint registered</span>`],
    [3900, `<span class="t-dim">INFO</span> <span class="t-text">Bucket4j rate limiter</span> <span class="t-warn">→ 100 req/min</span>`],
    [4100, `<span class="t-dim">INFO</span> <span class="t-text">DataForSEO client initialized</span>`],
    [4300, ``],
    [4350, `<span class="t-ok">✓ SmartSEO started</span> <span class="t-dim">in 2.847s</span>`],
    [4550, `<span class="t-dim">INFO</span> <span class="t-text">Listening on</span> <span class="t-str">http://localhost:8080</span>`],
    [4800, ``],
    [4850, `<span class="t-prompt">➜</span> <span class="t-hl">~/smartseo</span> <span class="t-dim">git:(main)</span>`],
  ];

  let scheduled = [];

  function runTerminal() {
    // Clear previous
    tb.innerHTML = '';
    scheduled.forEach(t => clearTimeout(t));
    scheduled = [];

    lines.forEach(([delay, html], i) => {
      const t = setTimeout(() => {
        const div = document.createElement('div');
        div.className = 't-line';
        div.innerHTML = html;
        tb.appendChild(div);
        // Keep scroll at bottom
        tb.scrollTop = tb.scrollHeight;

        // On last line, add blinking cursor then restart
        if (i === lines.length - 1) {
          const cur = document.createElement('span');
          cur.className = 'cursor-blink';
          div.appendChild(cur);
          // Restart after pause
          const restart = setTimeout(runTerminal, 3500);
          scheduled.push(restart);
        }
      }, delay);
      scheduled.push(t);
    });
  }

  runTerminal();

  // Init skill bars at 0
  document.querySelectorAll('.skill-bar').forEach(b => b.style.width = '0');
