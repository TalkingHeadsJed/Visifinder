/* =================================================================
 * VisiFinder — Front-end behavior
 * Self-hosted, no third-party JS, runs deferred after DOM parsed.
 * ================================================================= */
(function () {
    'use strict';

    /* ---------- Lucide icons (self-hosted) ---------- */
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-question').forEach(function (button) {
        button.addEventListener('click', function () {
            var item = button.parentElement;
            var isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function (i) {
                i.classList.remove('active');
            });
            if (!isActive) item.classList.add('active');
        });
    });

    /* ---------- Smooth-scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = anchor.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- Vimeo facade: only load player on click ---------- */
    var facade = document.querySelector('.video-facade');
    if (facade) {
        facade.addEventListener('click', function () {
            var wrap = facade.closest('.video-embed-wrap');
            var src  = 'https://player.vimeo.com/video/1167550168?h=a761b4636b&autoplay=1&title=0&byline=0&portrait=0';
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', src);
            iframe.setAttribute('title', 'VisiFinder Explainer Video');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write');
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
            wrap.innerHTML = '';
            wrap.appendChild(iframe);
            if (window.gtag) window.gtag('event', 'video_play', { video: 'explainer' });
        });
    }

    /* ---------- Exit-intent popup (desktop only, once per session) ---------- */
    var popup = document.getElementById('exitPopup');
    if (popup) {
        var popupShown = false;
        document.addEventListener('mouseout', function (e) {
            if (e.clientY <= 0 && !popupShown && !sessionStorage.getItem('popupDismissed')) {
                popup.classList.add('active');
                popupShown = true;
                if (window.gtag) window.gtag('event', 'exit_intent_shown');
            }
        });
        var closeBtn = document.getElementById('closePopup');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                popup.classList.remove('active');
                sessionStorage.setItem('popupDismissed', 'true');
            });
        }
        popup.addEventListener('click', function (e) {
            if (e.target === popup) {
                popup.classList.remove('active');
                sessionStorage.setItem('popupDismissed', 'true');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                popup.classList.remove('active');
                sessionStorage.setItem('popupDismissed', 'true');
            }
        });
    }

    /* ---------- Phone-click telemetry + ripple feedback ---------- */
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
        a.addEventListener('click', function () {
            a.classList.add('btn-clicked');
            setTimeout(function () { a.classList.remove('btn-clicked'); }, 220);
            if (window.gtag) window.gtag('event', 'phone_click', { phone: a.getAttribute('href') });
        });
    });

    /* ---------- Form-submit telemetry ---------- */
    document.querySelectorAll('form[action="process-form.php"]').forEach(function (f) {
        f.addEventListener('submit', function () {
            if (window.gtag) {
                window.gtag('event', 'generate_lead', {
                    form_id: f.id || 'unknown'
                });
            }
        });
    });
})();
