/* ============================================================
   PARTICLE CANVAS SYSTEM
============================================================ */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 90;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.45 + 0.1;
        this.targetOpacity = this.opacity;
        this.flickerSpeed = Math.random() * 0.015 + 0.005;
        const r = Math.random();
        if (r < 0.5) {
            this.color = '108, 99, 255';      // primary purple
        } else if (r < 0.8) {
            this.color = '61, 220, 132';       // secondary green
        } else {
            this.color = '34, 211, 238';       // accent cyan
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Flicker
        this.opacity += (Math.random() - 0.5) * this.flickerSpeed;
        this.opacity = Math.max(0.05, Math.min(0.5, this.opacity));

        const margin = 20;
        if (this.x < -margin || this.x > canvas.width + margin ||
            this.y < -margin || this.y > canvas.height + margin) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                const alpha = 0.07 * (1 - dist / MAX_DIST);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ============================================================
   CURSOR GLOW FOLLOW
============================================================ */
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

/* ============================================================
   TYPED.JS — Role Typing Effect
============================================================ */
new Typed('#typed-text', {
    strings: [
        'Android Developer',
        'Kotlin Developer',
        'Firebase Engineer',
        'App Deployer',
        'Problem Solver'
    ],
    typeSpeed: 65,
    backSpeed: 42,
    backDelay: 2200,
    startDelay: 600,
    loop: true,
    showCursor: true,
    cursorChar: '|'
});

/* ============================================================
   AOS — Animate on Scroll
============================================================ */
AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: false,
    mirror: false,
    offset: 70
});

/* ============================================================
   NAVBAR MENU TOGGLE
============================================================ */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

/* ============================================================
   SCROLL EVENTS — Sticky Header, Active Nav, Skill Bars
============================================================ */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
let skillsAnimated = false;

function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky header
    header.classList.toggle('sticky', scrollY > 60);

    // Active nav link
    sections.forEach(section => {
        const top = section.offsetTop - 220;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });

    // Close mobile menu on scroll
    if (scrollY > 60) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }

    // Trigger skill bar animation
    triggerSkillBars();
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ============================================================
   SKILL BAR ANIMATION — Triggered on Scroll
============================================================ */
function triggerSkillBars() {
    if (skillsAnimated) return;

    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    const sectionTop = skillsSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.75;

    if (sectionTop < triggerPoint) {
        skillsAnimated = true;
        const bars = document.querySelectorAll('.skill-progress');
        bars.forEach((bar, i) => {
            const targetWidth = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
                bar.classList.add('animated');
            }, i * 120);
        });
    }
}

// Also trigger on page load if skills section is already visible
window.addEventListener('load', () => {
    handleScroll();
    triggerSkillBars();
});

/* ============================================================
   CLOSE NAVBAR ON NAV LINK CLICK
============================================================ */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

/* ============================================================
   PROJECT CARD — Mouse Parallax Tilt Effect
============================================================ */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = ((y - midY) / midY) * -5;
        const rotateY = ((x - midX) / midX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease, border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease';
    });
});

/* ============================================================
   PROJECT CARD — Technical Deep-Dive Expander
   ============================================================ */
function initTechDive() {
    const techBtns = document.querySelectorAll('.tech-dive-btn');
    techBtns.forEach(btn => {
        // Prevent duplicate listener registration
        if (btn.getAttribute('data-listener') === 'true') return;
        btn.setAttribute('data-listener', 'true');

        btn.addEventListener('click', () => {
            const panel = btn.nextElementSibling;
            const chevron = btn.querySelector('.toggle-chevron');
            
            panel.classList.toggle('active');
            btn.classList.toggle('active');
            
            if (panel.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + "px";
                if (chevron) chevron.style.transform = "rotate(180deg)";
            } else {
                panel.style.maxHeight = null;
                if (chevron) chevron.style.transform = "rotate(0deg)";
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechDive);
} else {
    initTechDive();
}

