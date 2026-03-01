// === THEME TOGGLE ===

(function() {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

function initTheme() {
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  updateToggleIcon(isDark);

  toggle.addEventListener('click', function() {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcon(isDark);
  });
}

function updateToggleIcon(isDark) {
  var sun = document.querySelector('.icon-sun');
  var moon = document.querySelector('.icon-moon');
  if (sun && moon) {
    sun.style.display = isDark ? 'none' : 'block';
    moon.style.display = isDark ? 'block' : 'none';
  }
}

// === NAVBAR AUTO-HIDE ===

function initNavbar() {
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
  initNavbar();
  initAudioPlayers();
});
