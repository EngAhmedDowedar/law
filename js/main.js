// ========================================
// ⚙️ إعدادات ثابتة
// ========================================
const WHATSAPP_NUMBER = "201007929693";

// ========================================
// Throttle Helper
// ========================================
function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}

// ========================================
// Touch Device Detection
// ========================================
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

// ========================================
// Custom Cursor Logic
// ========================================
try {
    if (!isTouchDevice()) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (cursorDot && cursorOutline) {
            window.addEventListener('mousemove', throttle(function (e) {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 150, fill: "forwards" });
            }, 16));

            const clickables = document.querySelectorAll('a, button, input, textarea, .service-card, .news-card, .feature-box');
            clickables.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        }
    }
} catch (err) {
    console.warn('Custom cursor error:', err);
}

// ========================================
// Scroll Progress Bar
// ========================================
const scrollProgressEl = document.getElementById("scrollProgress");
if (scrollProgressEl) {
    window.addEventListener('scroll', throttle(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgressEl.style.width = scrolled + "%";
    }, 16), { passive: true });
}

// ========================================
// Preloader
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }, 800);
    }
    AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 50 });
});

// ========================================
// Particles
// ========================================
(function () {
    const container = document.getElementById('particles');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        container.appendChild(p);
    }
})();

// ========================================
// Navbar Scroll Effect & Outside Click Close
// ========================================
const navbar = document.getElementById('mainNavbar');
const toggler = document.querySelector('.navbar-toggler');
const collapseMenu = document.getElementById('navbarNav');

if (navbar) {
    window.addEventListener('scroll', throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, 100), { passive: true });
}

document.addEventListener('click', function (event) {
    if (!navbar || !collapseMenu) return;
    const isClickInside = navbar.contains(event.target);
    if (!isClickInside && collapseMenu.classList.contains('show')) {
        if (toggler) toggler.click();
    }
});

// ========================================
// Smooth Scroll & Close Menu
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        if (!targetId) return;

        if (this.classList.contains('social-link')) return;

        e.preventDefault();
        const target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (toggler && !toggler.classList.contains('collapsed')) {
            toggler.click();
        }
    });
});

// ========================================
// Scroll Spy
// ========================================
const navbarLinks = document.querySelectorAll('.navbar .nav-link');
const allSections = document.querySelectorAll('header[id], section[id]');
const NAVBAR_HEIGHT = navbar ? navbar.offsetHeight : 76;
const navSectionIds = Array.from(navbarLinks).map(link => link.getAttribute('href').substring(1));

function updateActiveLink() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPos + windowHeight >= documentHeight - 50) {
        navbarLinks.forEach(link => link.classList.remove('active'));
        if (navbarLinks.length > 0) navbarLinks[navbarLinks.length - 1].classList.add('active');
        return;
    }

    let currentSection = '';
    for (let i = allSections.length - 1; i >= 0; i--) {
        const section = allSections[i];
        const sectionId = section.getAttribute('id');
        if (!navSectionIds.includes(sectionId)) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= NAVBAR_HEIGHT + 100) {
            currentSection = sectionId;
            break;
        }
    }

    if (!currentSection) currentSection = 'home';

    navbarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
updateActiveLink();

// ========================================
// Counter Animation
// ========================================
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(update);
            } else {
                counter.textContent = target === 100 ? target + '%' : '+' + target;
                counter.dataset.animated = 'true';
            }
        };
        requestAnimationFrame(update);
    });
}

const statsEl = document.getElementById('stats');
if (statsEl) {
    new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }).observe(statsEl);
}

// ========================================
// Typing Effect
// ========================================
(function () {
    const texts = [
        'مستشار قانوني ومحامي بالنقض',
        'خبرة قانونية استثنائية',
        'دقة في صياغة العقود وتأسيس الشركات',
        'حماية حقوقك هي غايتنا الأولى'
    ];
    const el = document.getElementById('typingText');
    if (!el) return;

    let textIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const txt = texts[textIdx];
        el.textContent = txt.substring(0, deleting ? --charIdx : ++charIdx);
        let speed = deleting ? 30 : 80;

        if (!deleting && charIdx === txt.length) {
            speed = 2000; deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            textIdx = (textIdx + 1) % texts.length;
            speed = 300;
        }
        setTimeout(type, speed);
    }
    setTimeout(type, 1500);
})();

// ========================================
// Scroll to Top
// ========================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', throttle(() => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, 100), { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Form Validation & WhatsApp Logic
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');

    const handleInputValidation = function () {
        if (this.checkValidity()) {
            this.classList.remove('is-invalid');
        }
    };

    formInputs.forEach(input => {
        input.addEventListener('input', handleInputValidation);
        input.addEventListener('paste', handleInputValidation);
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.checkValidity()) {
            this.classList.add('was-validated');

            formInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            return;
        }

        const nameEl = document.getElementById('name');
        const phoneEl = document.getElementById('phone');
        const emailEl = document.getElementById('email');
        const messageEl = document.getElementById('message');

        if (!nameEl || !phoneEl || !messageEl) return;

        const name = nameEl.value.trim();
        const phone = phoneEl.value.trim();
        const email = emailEl ? emailEl.value.trim() : '';
        const message = messageEl.value.trim();

        let rawMsg = `مرحباً معالي المستشار الحسين دويدار، أنا ${name}\nرقم الهاتف: ${phone}\n`;
        if (email) rawMsg += `البريد الإلكتروني: ${email}\n`;
        rawMsg += `\nتفاصيل الاستشارة:\n${message}`;

        const encodedMsg = encodeURIComponent(rawMsg);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');

        this.reset();
        this.classList.remove('was-validated');
        contactForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    });
}
