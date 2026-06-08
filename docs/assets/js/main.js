
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem("theme");
  const themeBtn = document.getElementById("themeBtn");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  if (themeBtn) {
    themeBtn.textContent = document.body.classList.contains("light") ? "☀️ 淺色" : "🌙 深色";

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      themeBtn.textContent = isLight ? "☀️ 淺色" : "🌙 深色";
    });
  }

  const typingElement = document.getElementById("typing");
  if (typingElement) {
    const words = [
      "數位 IC 設計學習者",
      "FPGA 工程實作",
      "硬體安全研究",
      "Verilog RTL 設計",
      "VLSI 設計流程"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = words[wordIndex];

      if (!deleting) {
        typingElement.textContent = current.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1200);
          return;
        }
      } else {
        typingElement.textContent = current.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      setTimeout(typeLoop, deleting ? 45 : 85);
    }

    typeLoop();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        entry.target.querySelectorAll(".bar-fill").forEach(bar => {
          bar.style.width = bar.dataset.width;
        });

        entry.target.querySelectorAll(".counter").forEach(counter => {
          if (counter.dataset.done) return;
          counter.dataset.done = "true";
          animateCounter(counter);
        });
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal, .skill-card, .stat").forEach(el => observer.observe(el));

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });

  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 90;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      r: Math.random() * 1.8 + 0.8
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = document.body.classList.contains("light")
        ? "rgba(14, 165, 233, 0.55)"
        : "rgba(98, 230, 255, 0.72)";
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = document.body.classList.contains("light")
            ? `rgba(14, 165, 233, ${0.16 * (1 - dist / 120)})`
            : `rgba(98, 230, 255, ${0.22 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawParticles();
});
