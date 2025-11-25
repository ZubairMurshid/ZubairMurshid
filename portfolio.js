document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initTechCanvas();
    initScrollAnimations();
    initStatsCounter();
    initSkillRadar();
    initProjectFilters();
    initContactForm();
    initSmoothScroll();
});

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initTechCanvas() {
    const canvas = document.getElementById('techCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'dark' ? 'rgba(14, 165, 233, 0.8)' : 'rgba(30, 58, 138, 0.6)';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const theme = document.documentElement.getAttribute('data-theme');
        const lineColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 58, 138, 0.15)';

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.project-card, .education-card, .timeline-item, .stat-card, .skill-category, .blog-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateStats();
            }
        });
    }, observerOptions);

    if (stats.length > 0) {
        observer.observe(stats[0].parentElement.parentElement);
    }

    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            updateCount();
        });
    }
}

function initSkillRadar() {
    const canvas = document.getElementById('skillRadar');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;

    const skills = [
        { name: 'Programming', value: 85 },
        { name: 'Web Development', value: 80 },
        { name: 'Database', value: 80 },
        { name: 'Cybersecurity', value: 75 },
        { name: 'Problem Solving', value: 85 },
        { name: 'Team Work', value: 90 }
    ];

    const angleStep = (Math.PI * 2) / skills.length;

    function drawRadarChart() {
        const theme = document.documentElement.getAttribute('data-theme');
        const gridColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 58, 138, 0.15)';
        const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
        const fillColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(30, 58, 138, 0.2)';
        const strokeColor = theme === 'dark' ? '#0EA5E9' : '#1e3a8a';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            const levelRadius = (radius / 5) * i;

            for (let j = 0; j <= skills.length; j++) {
                const angle = angleStep * j - Math.PI / 2;
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);

                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for (let i = 0; i < skills.length; i++) {
            const angle = angleStep * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
            );
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.beginPath();
        for (let i = 0; i <= skills.length; i++) {
            const skill = skills[i % skills.length];
            const angle = angleStep * i - Math.PI / 2;
            const skillRadius = (radius * skill.value) / 100;
            const x = centerX + skillRadius * Math.cos(angle);
            const y = centerY + skillRadius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            const angle = angleStep * i - Math.PI / 2;
            const skillRadius = (radius * skill.value) / 100;
            const x = centerX + skillRadius * Math.cos(angle);
            const y = centerY + skillRadius * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.fill();
        }

        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            const angle = angleStep * i - Math.PI / 2;
            const labelRadius = radius + 40;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);

            ctx.fillText(skill.name, x, y);
        }
    }

    drawRadarChart();

    const themeObserver = new MutationObserver(() => {
        drawRadarChart();
    });

    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    const categories = card.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const subject = form.querySelector('#subject').value;
        const message = form.querySelector('#message').value;

        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        showFormMessage('Thank you for your message! I will get back to you soon.', 'success');

        form.reset();

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

const themeObserver = new MutationObserver(() => {
    const canvas = document.getElementById('skillRadar');
    if (canvas) {
        const event = new Event('themechange');
        window.dispatchEvent(event);
    }
});

themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});