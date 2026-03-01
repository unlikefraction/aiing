// === THEME TOGGLE ===

function initTheme() {
  var toggles = document.querySelectorAll('.theme-toggle');
  if (!toggles.length) return;

  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  updateToggleIcons(isDark);

  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      isDark = !isDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateToggleIcons(isDark);
    });
  });
}

function updateToggleIcons(isDark) {
  document.querySelectorAll('.theme-toggle').forEach(function(toggle) {
    var sun = toggle.querySelector('.icon-sun');
    var moon = toggle.querySelector('.icon-moon');
    if (sun && moon) {
      sun.style.display = isDark ? 'none' : 'block';
      moon.style.display = isDark ? 'block' : 'none';
    }
  });
}

// === NAVBAR - HOMEPAGE (IntersectionObserver) ===

function initHeroObserver() {
  var hero = document.getElementById('hero');
  var navbar = document.getElementById('navbar');
  if (!hero || !navbar) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
    });
  }, { threshold: 0 });

  observer.observe(hero);
}

// === NAVBAR - POST PAGE (scroll direction) ===

function initPostNavbar() {
  var hero = document.getElementById('hero');
  if (hero) return; // homepage uses IntersectionObserver instead

  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var lastY = window.scrollY;
  var ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var currentY = window.scrollY;
        if (currentY > lastY && currentY > 60) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// === SHARE BUTTON ===

function sharePost() {
  var btn = document.getElementById('shareBtn');
  if (!btn) return;

  navigator.clipboard.writeText(window.location.href).then(function() {
    var original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  });
}

// === RAW AUDIO TOGGLE ===

function toggleAudio() {
  var toggle = document.getElementById('audioToggle');
  var panel = document.getElementById('audioPanel');
  if (!toggle || !panel) return;

  var expanded = toggle.classList.toggle('expanded');
  if (expanded) {
    panel.classList.add('open');
  } else {
    panel.classList.remove('open');
  }
}

// === CUSTOM AUDIO PLAYER ===

function initAudioPlayers() {
  var players = document.querySelectorAll('.custom-audio');
  players.forEach(function(player) {
    var src = player.getAttribute('data-src');
    var audio = new Audio(src);
    var playBtn = player.querySelector('.audio-play-btn');
    var playIcon = player.querySelector('.play-icon');
    var pauseIcon = player.querySelector('.pause-icon');
    var progressBar = player.querySelector('.audio-progress-bar');
    var progressWrap = player.querySelector('.audio-progress');
    var timeDisplay = player.querySelector('.audio-time');

    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      var m = Math.floor(s / 60);
      var sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    playBtn.addEventListener('click', function() {
      if (audio.paused) {
        // Pause all other players
        document.querySelectorAll('.custom-audio').forEach(function(other) {
          if (other !== player && other._audio && !other._audio.paused) {
            other._audio.pause();
            other.querySelector('.play-icon').style.display = 'block';
            other.querySelector('.pause-icon').style.display = 'none';
          }
        });
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('timeupdate', function() {
      var pct = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = pct + '%';
      timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    });

    audio.addEventListener('ended', function() {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
    });

    progressWrap.addEventListener('click', function(e) {
      var rect = progressWrap.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    player._audio = audio;
  });
}

// === INIT ===

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initHeroObserver();
  initPostNavbar();
  initAudioPlayers();
});
