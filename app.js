/* ============================================
   REACT GUIDE — App Logic & Interactivity
   ============================================ */

(function () {
  'use strict';

  // ===========================
  // THEME (Dark / Light) Toggle
  // ===========================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('react-guide-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('react-guide-theme', next);
    updateThemeIcon(next);
  });

  // Keyboard support
  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  // ===========================
  // MOBILE SIDEBAR TOGGLE
  // ===========================
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // Close sidebar when a link is clicked (mobile)
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      }
    });
  });

  // ===========================
  // SCROLL PROGRESS BAR
  // ===========================
  const progressBar = document.getElementById('progressBar');

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // ===========================
  // ACTIVE SIDEBAR LINK on SCROLL
  // ===========================
  const sections = document.querySelectorAll('.section');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const progressPercent = document.getElementById('progressPercent');
  const sidebarProgressFill = document.getElementById('sidebarProgressFill');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 150;
    let activeIdx = -1;

    sections.forEach((section, idx) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeIdx = idx;
      }
    });

    sidebarLinks.forEach((link, idx) => {
      link.classList.toggle('active', idx === activeIdx);
    });

    // Update progress
    const totalSections = sections.length;
    const completed = activeIdx >= 0 ? activeIdx : 0;
    const pct = Math.round(((completed + 1) / totalSections) * 100);
    progressPercent.textContent = pct + '%';
    sidebarProgressFill.style.width = pct + '%';
  }

  // ===========================
  // SCROLL REVEAL SECTIONS
  // ===========================
  function revealSections() {
    const trigger = window.innerHeight * 0.85;

    // Sections
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < trigger) {
        section.classList.add('visible');
      }
    });

    // Stagger children
    document.querySelectorAll('.stagger-children').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) {
        el.classList.add('visible');
      }
    });

    // Generic reveal classes
    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  // Combined scroll handler (throttled)
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateProgressBar();
        updateActiveSection();
        revealSections();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Initial calls
  updateProgressBar();
  updateActiveSection();
  revealSections();

  // ===========================
  // VIRTUAL DOM ANIMATION
  // ===========================
  const vdomUpdateBtn = document.getElementById('vdomUpdateBtn');
  const vdomName = document.getElementById('vdomName');
  const diffNode = document.getElementById('diffNode');
  const realDomNode = document.getElementById('realDomNode');

  const names = ['Hello, World', 'Hello, React', 'Hello, Student', 'Hello, Developer', 'Hello, Builder'];
  let nameIndex = 0;

  vdomUpdateBtn.addEventListener('click', () => {
    nameIndex = (nameIndex + 1) % names.length;
    const newName = names[nameIndex];

    // Step 1: Update Virtual DOM
    vdomName.textContent = `<h1>${newName}</h1>`;
    vdomName.classList.add('changed');

    // Step 2: Show diff
    setTimeout(() => {
      diffNode.textContent = '<h1> ✏️ changed!';
      diffNode.style.opacity = '1';
      diffNode.classList.add('changed');
    }, 400);

    // Step 3: Update Real DOM
    setTimeout(() => {
      realDomNode.textContent = `<h1>${newName}</h1>`;
      realDomNode.classList.add('changed');
    }, 800);

    // Reset animations
    setTimeout(() => {
      vdomName.classList.remove('changed');
      diffNode.classList.remove('changed');
      realDomNode.classList.remove('changed');
      diffNode.style.opacity = '0.4';
    }, 2000);
  });

  // ===========================
  // COMPONENT TREE HIGHLIGHT
  // ===========================
  window.highlightTreeNode = function (el) {
    // Remove highlight from all
    document.querySelectorAll('.tree-node-box').forEach(box => {
      box.classList.remove('highlighted');
    });
    el.classList.add('highlighted');

    // Remove after a few seconds
    setTimeout(() => {
      el.classList.remove('highlighted');
    }, 3000);
  };

  // ===========================
  // HMR (Hot Reload) Demo
  // ===========================
  const hmrInput = document.getElementById('hmrInput');
  const hmrOutput = document.getElementById('hmrOutput');

  hmrInput.addEventListener('input', () => {
    hmrOutput.textContent = hmrInput.value || 'Type something...';
    // Quick scale animation
    hmrOutput.style.transform = 'scale(1.05)';
    setTimeout(() => {
      hmrOutput.style.transform = 'scale(1)';
    }, 150);
  });

  // ===========================
  // COUNTER DEMO (State)
  // ===========================
  const counterDisplay = document.getElementById('counterDisplay');
  const counterInc = document.getElementById('counterInc');
  const counterDec = document.getElementById('counterDec');
  const counterReset = document.getElementById('counterReset');
  let count = 0;

  function updateCounter(newCount) {
    count = newCount;
    counterDisplay.textContent = count;
    counterDisplay.classList.add('animate');
    setTimeout(() => counterDisplay.classList.remove('animate'), 300);
  }

  counterInc.addEventListener('click', () => updateCounter(count + 1));
  counterDec.addEventListener('click', () => updateCounter(count - 1));
  counterReset.addEventListener('click', () => updateCounter(0));

  // ===========================
  // TOGGLE MESSAGE DEMO
  // ===========================
  const toggleMsgBtn = document.getElementById('toggleMsgBtn');
  const toggleMsgContent = document.getElementById('toggleMsgContent');
  let msgVisible = false;

  toggleMsgBtn.addEventListener('click', () => {
    msgVisible = !msgVisible;
    toggleMsgContent.style.display = msgVisible ? 'block' : 'none';
    toggleMsgBtn.textContent = msgVisible ? 'Hide Message' : 'Show Message';
  });

  // ===========================
  // FETCH USERS DEMO (API)
  // ===========================
  const fetchUsersBtn = document.getElementById('fetchUsersBtn');
  const fetchResult = document.getElementById('fetchResult');

  fetchUsersBtn.addEventListener('click', () => {
    fetchResult.innerHTML = '<div class="spinner"></div><span style="color:var(--text-tertiary);font-size:0.85rem;margin-top:8px">Loading users...</span>';
    fetchUsersBtn.disabled = true;
    fetchUsersBtn.textContent = '⏳ Loading...';

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => {
        const listHTML = users.slice(0, 5).map(u => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--bg-secondary);border-radius:var(--radius-sm);border:1px solid var(--border-color);width:100%;transition:transform 0.2s ease"
               onmouseenter="this.style.transform='translateX(4px)'" onmouseleave="this.style.transform='translateX(0)'">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-gradient);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8rem;flex-shrink:0">
              ${u.name.charAt(0)}
            </div>
            <div>
              <div style="font-weight:600;font-size:0.9rem;color:var(--text-primary)">${u.name}</div>
              <div style="font-size:0.78rem;color:var(--text-tertiary)">${u.email}</div>
            </div>
          </div>
        `).join('');

        fetchResult.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:8px;width:100%;align-items:stretch">
            ${listHTML}
          </div>
          <small style="color:var(--text-tertiary);margin-top:8px;font-size:0.75rem">✅ Fetched ${users.length} users from jsonplaceholder API</small>
        `;

        fetchUsersBtn.disabled = false;
        fetchUsersBtn.textContent = '🔄 Fetch Again';
      })
      .catch(err => {
        fetchResult.innerHTML = `<span style="color:var(--error)">❌ Error fetching data. Check your internet connection.</span>`;
        fetchUsersBtn.disabled = false;
        fetchUsersBtn.textContent = '🔄 Retry';
      });
  });

  // ===========================
  // TABS
  // ===========================
  window.switchTab = function (event, tabId) {
    // Update buttons
    const header = event.target.closest('.tabs-header');
    header.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update content
    const tabs = event.target.closest('.tabs');
    tabs.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  };

  // ===========================
  // COPY CODE BUTTON
  // ===========================
  window.copyCode = function (btn) {
    const codeBlock = btn.closest('.code-block');
    const codeBody = codeBlock.querySelector('.code-body pre');
    const text = codeBody.textContent;

    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '✓ Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '📋 Copy';
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        btn.classList.add('copied');
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '📋 Copy';
        }, 2000);
      } catch (e) {
        btn.textContent = '❌ Failed';
      }
      document.body.removeChild(textarea);
    });
  };

  // ===========================
  // EXERCISES (Quiz System)
  // ===========================
  document.querySelectorAll('.exercise-options').forEach(optionsContainer => {
    const options = optionsContainer.querySelectorAll('.exercise-option');
    const exercise = optionsContainer.closest('.exercise');
    const checkBtn = exercise.querySelector('.exercise-check-btn');
    const feedback = exercise.querySelector('.exercise-feedback');
    const correctValue = optionsContainer.getAttribute('data-correct');
    let selectedValue = null;
    let answered = false;

    options.forEach(option => {
      option.addEventListener('click', () => {
        if (answered) return;

        // Deselect all
        options.forEach(o => o.classList.remove('selected'));

        // Select this one
        option.classList.add('selected');
        selectedValue = option.getAttribute('data-value');
        checkBtn.disabled = false;
      });
    });

    checkBtn.addEventListener('click', () => {
      if (!selectedValue || answered) return;
      answered = true;

      const isCorrect = selectedValue === correctValue;

      // Highlight correct / wrong
      options.forEach(option => {
        const val = option.getAttribute('data-value');
        if (val === correctValue) {
          option.classList.add('correct-answer');
        } else if (val === selectedValue && !isCorrect) {
          option.classList.add('wrong-answer');
        }
        // Disable further clicks visually
        option.style.cursor = 'default';
      });

      // Show feedback
      feedback.classList.add('show');
      if (isCorrect) {
        feedback.classList.add('correct');
        feedback.innerHTML = '🎉 <strong>Correct!</strong> Great job — you understood this perfectly.';
        exercise.classList.add('correct');
      } else {
        feedback.classList.add('incorrect');
        feedback.innerHTML = '❌ <strong>Not quite.</strong> The correct answer is highlighted in green. Review the section above and try to understand why.';
        exercise.classList.add('incorrect');
      }

      checkBtn.disabled = true;
      checkBtn.textContent = isCorrect ? '✓ Correct' : '✗ Answered';

      // Save progress
      saveProgress(optionsContainer.getAttribute('data-exercise'), isCorrect);
    });
  });

  // ===========================
  // PROGRESS TRACKING
  // ===========================
  function saveProgress(exerciseId, isCorrect) {
    const progress = JSON.parse(localStorage.getItem('react-guide-progress') || '{}');
    progress[`ex${exerciseId}`] = isCorrect;
    localStorage.setItem('react-guide-progress', JSON.stringify(progress));
    updateSidebarProgress();
  }

  function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('react-guide-progress') || '{}');
    // Restore answered exercises
    Object.keys(progress).forEach(key => {
      const exNum = key.replace('ex', '');
      const optionsContainer = document.querySelector(`.exercise-options[data-exercise="${exNum}"]`);
      if (!optionsContainer) return;

      const exercise = optionsContainer.closest('.exercise');
      const checkBtn = exercise.querySelector('.exercise-check-btn');
      const feedback = exercise.querySelector('.exercise-feedback');
      const correctValue = optionsContainer.getAttribute('data-correct');

      // Mark as answered
      if (progress[key]) {
        // Mark correct option
        const correctOption = optionsContainer.querySelector(`[data-value="${correctValue}"]`);
        if (correctOption) {
          correctOption.classList.add('correct-answer', 'selected');
        }
        feedback.classList.add('show', 'correct');
        feedback.innerHTML = '🎉 <strong>Correct!</strong> Great job — you understood this perfectly.';
        exercise.classList.add('correct');
        checkBtn.disabled = true;
        checkBtn.textContent = '✓ Correct';
      }

      // Disable all options
      optionsContainer.querySelectorAll('.exercise-option').forEach(o => {
        o.style.cursor = 'default';
      });
    });

    updateSidebarProgress();
  }

  function updateSidebarProgress() {
    const progress = JSON.parse(localStorage.getItem('react-guide-progress') || '{}');
    const totalExercises = document.querySelectorAll('.exercise-options').length;
    const completedCorrectly = Object.values(progress).filter(v => v === true).length;
    const pct = totalExercises > 0 ? Math.round((completedCorrectly / totalExercises) * 100) : 0;
    // We keep the scroll-based progress for the sidebar, but this is exercise progress
  }

  loadProgress();

  // ===========================
  // SMOOTH SCROLL for anchor links
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===========================
  // TOPBAR shrink on scroll
  // ===========================
  const topbar = document.getElementById('topbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      topbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      topbar.style.boxShadow = 'none';
    }
  });

  // ===========================
  // KEYBOARD NAVIGATION
  // ===========================
  document.addEventListener('keydown', (e) => {
    // Escape closes sidebar on mobile
    if (e.key === 'Escape') {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
  });

})();
