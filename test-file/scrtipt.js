// /==================================================
const link = 'http://localhost/iD4Center/wp-content/uploads/2025/08/MHDPT-1.png';
const link2 = 'http://localhost/iD4Center/wp-content/uploads/2025/08/MHDPT-2@4x.png';

document.addEventListener('DOMContentLoaded', function() {
    const imageSources = [
        link, link2, link, link2, link, link2
    ];

    let currentImageIndex = 0;
    const mainImage = document.getElementById('id4-main-image');
    const thumbnailsList = document.getElementById('thumbnails-list');
    const thumbnailsScrollContainer = document.getElementById('thumbnails-scroll-container');
    const light_box = document.getElementById('my-light_box');
    // ... (các biến khác giữ nguyên)
    const light_boxImage = document.getElementById('light_box-image');
    const closeButton = document.getElementById('light_box-close');
    const zoomIcon = document.getElementById('zoom-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const light_boxPrevBtn = document.getElementById('light_box-prev-btn');
    const light_boxNextBtn = document.getElementById('light_box-next-btn');


    function generatethumbnailss() {
        thumbnailsList.innerHTML = '';
        imageSources.forEach((src, index) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Ảnh thu nhỏ ${index + 1}`;
            thumb.className = 'thumbnails';
            thumb.dataset.index = index;
            // Bọc img trong một div để xử lý click dễ dàng hơn khi đang kéo
            const thumbWrapper = document.createElement('div');
            thumbWrapper.dataset.index = index;
            thumbWrapper.appendChild(thumb);
            thumbnailsList.appendChild(thumbWrapper);
        });
    }

    function updateMainImage(index) {
        currentImageIndex = index;
        mainImage.src = imageSources[currentImageIndex];
        document.querySelectorAll('.thumbnails').forEach(thumb => {
            const isActive = parseInt(thumb.dataset.index) === currentImageIndex;
            thumb.classList.toggle('active', isActive);
            if (isActive) {
                thumb.parentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    }

    // ... (các hàm khác giữ nguyên)
    function navigateGallery(direction) {
        let newIndex = currentImageIndex + direction;
        if (newIndex < 0) newIndex = imageSources.length - 1;
        else if (newIndex >= imageSources.length) newIndex = 0;
        updateMainImage(newIndex);
    }

    function openlight_box() {

        document.body.appendChild(light_box);
        light_boxImage.src = imageSources[currentImageIndex];
        light_box.classList.add('show');



    }

    function closelight_box() {
        light_box.classList.remove('show');
    }

    function navigatelight_box(direction) {
        let newIndex = currentImageIndex + direction;
        if (newIndex < 0) newIndex = imageSources.length - 1;
        else if (newIndex >= imageSources.length) newIndex = 0;

        currentImageIndex = newIndex;
        light_boxImage.src = imageSources[currentImageIndex];
        updateMainImage(currentImageIndex);
    }


    // Xử lý sự kiện click trên thumbnails (đã thay đổi để hoạt động tốt với chức năng kéo)
    thumbnailsList.addEventListener('click', e => {
        const target = e.target.closest('div[data-index]');
        if (target) {
            // Chỉ cập nhật ảnh nếu không có hành động kéo
            if (!thumbnailsScrollContainer.classList.contains('is-dragging')) {
                updateMainImage(parseInt(target.dataset.index));
            }
        }
    });

    // ... (các sự kiện click khác giữ nguyên)
    prevBtn.addEventListener('click', () => navigateGallery(-1));
    nextBtn.addEventListener('click', () => navigateGallery(1));
    zoomIcon.addEventListener('click', openlight_box);
    mainImage.addEventListener('click', openlight_box);
    closeButton.addEventListener('click', closelight_box);
    light_box.addEventListener('click', e => (e.target === light_box) && closelight_box());
    document.addEventListener('keydown', e => (e.key === "Escape") && closelight_box());
    light_boxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatelight_box(-1);
    });
    light_boxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatelight_box(1);
    });


    // SỬA LỖI: Thêm chức năng kéo-để-cuộn trên máy tính
    let isDown = false;
    let startX;
    let scrollLeft;

    thumbnailsScrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        thumbnailsScrollContainer.classList.add('active');
        thumbnailsScrollContainer.classList.remove('is-dragging');
        startX = e.pageX - thumbnailsScrollContainer.offsetLeft;
        scrollLeft = thumbnailsScrollContainer.scrollLeft;
    });
    thumbnailsScrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        thumbnailsScrollContainer.classList.remove('active');
    });
    thumbnailsScrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        thumbnailsScrollContainer.classList.remove('active');
        // Reset trạng thái kéo sau một khoảng trễ nhỏ
        setTimeout(() => thumbnailsScrollContainer.classList.remove('is-dragging'), 50);
    });
    thumbnailsScrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        thumbnailsScrollContainer.classList.add('is-dragging');
        const x = e.pageX - thumbnailsScrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // Tăng tốc độ kéo
        thumbnailsScrollContainer.scrollLeft = scrollLeft - walk;
    });

    generatethumbnailss();
    updateMainImage(0);
});




// ===============================================================
// thêm thuộc tính card hoad động


document.addEventListener("DOMContentLoaded", function() {
    const cardData = [{
        title: '✨ Linh hoạt',
        description: 'Tự động thích ứng giao diện từ desktop sang di động một cách mượt mà.',
        imageUrl: 'https://images.unsplash.com/photo-1526657782461-9fe13505d3d3?q=80&w=800&auto=format&fit=crop'
    }, {
        title: '🚀 Hiệu năng cao',
        description: 'Sử dụng Intersection Observer và các kỹ thuật hiện đại để đảm bảo độ mượt tối đa.',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800&auto=format&fit=crop'
    }, {
        title: '🎨 Giàu tương tác',
        description: 'Phản hồi với thao tác di chuột, click và điều hướng bàn phím một cách thông minh.',
        imageUrl: 'https://images.unsplash.com/photo-1534665482403-a909d0d97c67?q=80&w=800&auto=format&fit=crop'
    }, {
        title: '♿ Dễ tiếp cận',
        description: 'Hỗ trợ điều hướng bằng bàn phím, giúp mọi người dùng đều có thể trải nghiệm trọn vẹn.',
        imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop'
    }, {
        title: '📱 Đồng nhất',
        description: 'Trải nghiệm cuộn dọc-ngang độc đáo được đồng bộ trên mọi thiết bị, từ lớn đến nhỏ.',
        imageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=800&auto=format&fit=crop'
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