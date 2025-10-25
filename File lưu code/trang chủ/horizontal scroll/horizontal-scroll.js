// nơi chưa link và nội dung


const image1 = 'http://localhost/iD4Center/wp-content/uploads/2025/09/MHDPT-1.png';

document.addEventListener("DOMContentLoaded", function() {
    const cardData = [{
        title: '',
        description: 'Vị trí hạ mào xương/ Vị trí Implant/ Abutment / Phục hình: Tất cả đều được phân tích lên kế hoạch và thiết kế chính xác.',
        imageUrl: image1
    }, {
        title: '🚀 Hiệu năng cao',
        description: 'Sử dụng Intersection Observer và các kỹ thuật hiện đại để đảm bảo độ mượt tối đa.',
        imageUrl: image1
    }, {
        title: '🎨 Giàu tương tác',
        description: 'Phản hồi với thao tác di chuột, click và điều hướng bàn phím một cách thông minh.',
        imageUrl: image1
    }, {
        title: '♿ Dễ tiếp cận',
        description: 'Hỗ trợ điều hướng bằng bàn phím, giúp mọi người dùng đều có thể trải nghiệm trọn vẹn.',
        imageUrl: image1
    }, {
        title: '📱 Đồng nhất',
        description: 'Trải nghiệm cuộn dọc-ngang độc đáo được đồng bộ trên mọi thiết bị, từ lớn đến nhỏ.',
        imageUrl: image1
    }];

    const contentContainer = document.querySelector('.id4-horizontal-content');
    contentContainer.innerHTML = cardData.map(data => `
                <div class="id4-card">
                    <div class="id4-card-text">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>
                    <div class="id4-card-image">
                        <img src="${data.imageUrl}" alt="${data.title}" loading="lazy">
                    </div>
                </div>
            `).join('');

    const cards = Array.from(contentContainer.children);
    const track = document.querySelector('.id4-horizontal-track');

    const modalOverlay = document.querySelector('.id4-modal-overlay');
    const modalContent = document.querySelector('.id4-modal-content');
    const modalClose = document.querySelector('.id4-modal-close');
    const mainContainer = document.querySelector('.id4-container');

    function openModal(contentHTML) {
        modalContent.innerHTML = contentHTML;
        modalOverlay.classList.add('id4-active');
        mainContainer.classList.add('id4-modal-open');
    }

    function closeModal() {
        modalOverlay.classList.remove('id4-active');
        mainContainer.classList.remove('id4-modal-open');
    }

    cards.forEach(card => card.addEventListener('click', () => openModal(card.innerHTML)));
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('id4-active')) closeModal();
    });

    const progressBar = document.querySelector('.id4-progress-bar');
    const paginationContainer = document.querySelector('.id4-pagination-dots');
    let dots = [];

    if (paginationContainer) {
        cards.forEach((card, index) => {
            const dot = document.createElement('div');
            dot.classList.add('id4-dot');
            dot.addEventListener('click', () => {
                const scrollableDistance = track.offsetHeight - window.innerHeight;
                const progressPerCard = 1 / (cards.length - 1);
                const targetScrollTop = track.offsetTop + (scrollableDistance * progressPerCard * index);
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            });
            paginationContainer.appendChild(dot);
        });
        dots = Array.from(paginationContainer.children);
    }

    let currentX = 0,
        targetX = 0,
        easingFactor = 0.08,
        isTrackInView = false;

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function updateActiveDot(progress) {
        if (dots.length > 0) {
            const activeIndex = Math.min(dots.length - 1, Math.round(progress * (cards.length - 1)));
            dots.forEach((dot, index) => dot.classList.toggle('id4-active', index === activeIndex));
        }
    }

    function updatePositions() {
        const trackRect = track.getBoundingClientRect();
        if (trackRect.top <= 0 && trackRect.bottom >= window.innerHeight) {
            const scrollInTrack = -trackRect.top;
            const scrollableDistance = trackRect.height - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, scrollInTrack / scrollableDistance));

            const firstCard = cards[0],
                lastCard = cards[cards.length - 1];
            const contentScrollWidth = lastCard.offsetLeft - firstCard.offsetLeft;

            targetX = -contentScrollWidth * scrollProgress;
            if (progressBar) progressBar.style.width = (scrollProgress * 100) + '%';
            updateActiveDot(scrollProgress);

            const activeIndex = Math.round(scrollProgress * (cards.length - 1));
            cards.forEach((card, index) => {
                card.classList.toggle('id4-active', index === activeIndex);
            });
        } else {
            cards.forEach(card => card.classList.remove('id4-active'));
        }
        currentX = lerp(currentX, targetX, easingFactor);
        contentContainer.style.transform = `translateX(${currentX}px)`;
    }

    function applyParallax() {
        const windowCenterX = window.innerWidth / 2;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const distance = (cardCenterX - windowCenterX) / windowCenterX;
            const parallaxOffset = -distance * 30;
            const img = card.querySelector('.id4-card-image img');
            if (img) {
                img.style.transform = `translateX(${parallaxOffset}px)`;
            }
        });
    }

    function animationLoop() {
        if (isTrackInView) {
            updatePositions();
            applyParallax();
        }
        requestAnimationFrame(animationLoop);
    }

    const trackObserver = new IntersectionObserver((entries) => isTrackInView = entries[0].isIntersecting);
    trackObserver.observe(track);
    animationLoop();

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (modalOverlay.classList.contains('id4-active')) return;
            const trackRect = track.getBoundingClientRect();
            if (trackRect.top > 0 || trackRect.bottom < window.innerHeight) return;
            e.preventDefault();
            const scrollableDistance = track.offsetHeight - window.innerHeight;
            const progressPerCard = 1 / (cards.length - 1);
            const currentProgress = -trackRect.top / scrollableDistance;
            const currentIndex = Math.round(currentProgress / progressPerCard);
            let targetIndex = currentIndex;
            if (e.key === 'ArrowRight') targetIndex = Math.min(cards.length - 1, currentIndex + 1);
            else if (e.key === 'ArrowLeft') targetIndex = Math.max(0, currentIndex - 1);
            if (targetIndex !== currentIndex) {
                const targetScrollTop = track.offsetTop + (scrollableDistance * progressPerCard * targetIndex);
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});