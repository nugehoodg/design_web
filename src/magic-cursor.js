/**
 * Magic Cursor JS
 * High-performance custom cursor with smooth trailing effect.
 */

class MagicCursor {
    constructor() {
        this.dot = null;
        this.ring = null;
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.lerpAmount = 0.15;
        this.isHovering = false;
        this.started = false;
        
        this.init();
    }

    init() {
        // Only run if not on a touch device
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        this.createElements();
        this.addEventListeners();
        this.animate();
    }

    createElements() {
        this.dot = document.createElement('div');
        this.dot.className = 'magic-cursor-dot';
        this.dot.style.opacity = '0';
        
        this.ring = document.createElement('div');
        this.ring.className = 'magic-cursor-ring';
        this.ring.style.opacity = '0';
        
        document.body.appendChild(this.dot);
        document.body.appendChild(this.ring);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            if (!this.started) {
                this.started = true;
                this.dot.style.opacity = '1';
                this.ring.style.opacity = '1';
            }
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Use translate3d for GPU acceleration
            this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
        });

        window.addEventListener('mousedown', () => {
            this.ring.classList.add('clicking');
        });

        window.addEventListener('mouseup', () => {
            this.ring.classList.remove('clicking');
        });

        // Use passive listeners for scroll/touch if needed, but here we just need hover
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .btn, .bento-card, .tag-link, [role="button"], .nav-link, .back-btn');
            if (target) {
                this.isHovering = true;
                this.dot.classList.add('hover');
                this.ring.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .btn, .bento-card, .tag-link, [role="button"], .nav-link, .back-btn');
            if (target) {
                this.isHovering = false;
                this.dot.classList.remove('hover');
                this.ring.classList.remove('hover');
            }
        });

        document.addEventListener('mouseleave', () => {
            this.dot.style.opacity = '0';
            this.ring.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (this.started) {
                this.dot.style.opacity = '1';
                this.ring.style.opacity = '1';
            }
        });
    }

    lerp(start, end, amount) {
        return (1 - amount) * start + amount * end;
    }

    animate() {
        // Smoothly move the ring towards the mouse position
        this.pos.x = this.lerp(this.pos.x, this.mouse.x, this.lerpAmount);
        this.pos.y = this.lerp(this.pos.y, this.mouse.y, this.lerpAmount);
        
        this.ring.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new MagicCursor();
});
