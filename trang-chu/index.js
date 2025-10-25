document.addEventListener("DOMContentLoaded", function() {
    // Biến toàn cục để theo dõi khối cuộn nào đang active
    let activeScrollInstance = null;

    const image1 = 'http://localhost/iD4Center/wp-content/uploads/2025/09/MHDPT-1.png';

    // Dữ liệu cho khối cuộn thứ nhất
    const cardData1 = [
        { title: '✨ Lập kế hoạch chính xác', description: 'Vị trí hạ mào xương/ Vị trí Implant/ Abutment / Phục hình: Tất cả đều được phân tích lên kế hoạch và thiết kế chính xác.', imageUrl: image1 },
        { title: '🚀 Hiệu năng cao', description: 'Sử dụng Intersection Observer và các kỹ thuật hiện đại để đảm bảo độ mượt tối đa.', imageUrl: image1 },
        { title: '🎨 Giàu tương tác', description: 'Phản hồi với thao tác di chuột, click và điều hướng bàn phím một cách thông minh.', imageUrl: image1 },
        { title: '♿ Dễ tiếp cận', description: 'Hỗ trợ điều hướng bằng bàn phím, giúp mọi người dùng đều có thể trải nghiệm trọn vẹn.', imageUrl: image1 },
        { title: '📱 Đồng nhất', description: 'Trải nghiệm cuộn dọc-ngang độc đáo được đồng bộ trên mọi thiết bị, từ lớn đến nhỏ.', imageUrl: image1 }
    ];

    // Dữ liệu cho khối cuộn thứ hai (nếu có)
    const cardData2 = [{
            title: 'Title for Section 2',
            description: 'Description for section 2.',
            imageUrl: image1
        },
        {
            title: 'Another title',
            description: 'Another description here.',
            imageUrl: image1
        }
    ];

    /**
     * HÀM KHỞI TẠO HIỆU ỨNG CUỘN NGANG (PHIÊN BẢN SỬA LỖI)
     * @param {object} config - Đối tượng cấu hình
     */
    function initializeHorizontalScroll(config) {
        const mainContainer = document.querySelector(config.selectors.mainContainer);
        if (!mainContainer) return;

        const contentContainer = mainContainer.querySelector(config.selectors.contentContainer);
        const track = mainContainer.querySelector(config.selectors.track);
        const modalOverlay = mainContainer.querySelector(config.selectors.modalOverlay);
        const modalContent = mainContainer.querySelector(config.selectors.modalContent);
        const modalClose = mainContainer.querySelector(config.selectors.modalClose);
        const progressBar = mainContainer.querySelector(config.selectors.progressBar);

        // Tạo HTML từ dữ liệu
        contentContainer.innerHTML = config.data.map(data => `
            <div class="${config.classes.card}">
                <div class="${config.classes.cardText}">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
                <div class="${config.classes.cardImage}">
                    <img src="${data.imageUrl}" alt="${data.title}" loading="lazy">
                </div>
            </div>
        `).join('');

        const cards = Array.from(contentContainer.children);

        // --- Logic của riêng instance này ---
        const instance = {
            track,
            cards,
            modalOverlay,
            closeModal: () => {
                modalOverlay.classList.remove(config.classes.active);
                document.body.classList.remove(config.classes.modalOpen);
            }
        };

        function openModal(contentHTML) {
            modalContent.innerHTML = contentHTML;
            modalOverlay.classList.add(config.classes.active);
            document.body.classList.add(config.classes.modalOpen);
        }

        cards.forEach(card => card.addEventListener('click', () => openModal(card.innerHTML)));
        modalClose.addEventListener('click', instance.closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) instance.closeModal();
        });

        // Logic cuộn và animation
        let currentX = 0,
            targetX = 0,
            easingFactor = 0.08;

        function lerp(start, end, t) { return start * (1 - t) + end * t; }

        function updatePositions() {
            const trackRect = track.getBoundingClientRect();
            if (trackRect.top <= 0 && trackRect.bottom >= window.innerHeight) {
                const scrollInTrack = -trackRect.top;
                const scrollableDistance = trackRect.height - window.innerHeight;
                const scrollProgress = Math.max(0, Math.min(1, scrollInTrack / scrollableDistance));

                const firstCard = cards[0];
                const lastCard = cards[cards.length - 1];
                const contentScrollWidth = lastCard.offsetLeft - firstCard.offsetLeft;

                targetX = -contentScrollWidth * scrollProgress;
                if (progressBar) progressBar.style.width = (scrollProgress * 100) + '%';
            }
            currentX = lerp(currentX, targetX, easingFactor);
            contentContainer.style.transform = `translateX(${currentX}px)`;
        }

        function animationLoop() {
            // Chỉ chạy animation nếu nó là instance đang active
            if (activeScrollInstance === instance) {
                updatePositions();
            }
            requestAnimationFrame(animationLoop);
        }

        // Dùng IntersectionObserver để set instance nào đang active
        const trackObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                activeScrollInstance = instance;
            } else {
                // Nếu instance này rời màn hình và nó đang là active, thì hủy active
                if (activeScrollInstance === instance) {
                    activeScrollInstance = null;
                }
            }
        }, { threshold: 0.1 }); // threshold 0.1 để đảm bảo một phần của track đã vào màn hình

        trackObserver.observe(track);
        animationLoop(); // Bắt đầu vòng lặp animation
    }

    // --- KHỞI TẠO CÁC KHỐI CUỘN ---
    // Khối 1
    initializeHorizontalScroll({
        data: cardData1,
        selectors: {
            mainContainer: '.id4-guide-container',
            contentContainer: '.id4-guide-horizontal-content',
            track: '.id4-guide-horizontal-track',
            modalOverlay: '.id4-guide-modal-overlay',
            modalContent: '.id4-guide-modal-content',
            modalClose: '.id4-guide-modal-close',
            progressBar: '.id4-guide-progress-bar',
        },
        classes: { /* ... các class cho khối 1 ... */
            card: 'id4-guide-card',
            cardText: 'id4-guide-card-text',
            cardImage: 'id4-guide-card-image',
            active: 'id4-guide-active',
            modalOpen: 'id4-guide-modal-open'
        }
    });

    // Khối 2
    initializeHorizontalScroll({
        data: cardData2,
        selectors: {
            mainContainer: '.id4-container',
            contentContainer: '.id4-horizontal-content',
            track: '.id4-horizontal-track',
            modalOverlay: '.id4-modal-overlay',
            modalContent: '.id4-modal-content',
            modalClose: '.id4-modal-close',
            progressBar: '.id4-progress-bar',
        },
        classes: { /* ... các class cho khối 2 ... */
            card: 'id4-card',
            cardText: 'id4-card-text',
            cardImage: 'id4-card-image',
            active: 'id4-active',
            modalOpen: 'id4-modal-open'
        }
    });

    // --- TRÌNH LẮNG NGHE BÀN PHÍM TOÀN CỤC DUY NHẤT ---
    window.addEventListener('keydown', (e) => {
        // Luôn kiểm tra xem có instance nào đang active không
        if (!activeScrollInstance) return;

        // 1. Logic đóng Modal bằng phím Escape
        if (e.key === 'Escape' && activeScrollInstance.modalOverlay.classList.contains('id4-guide-active', 'id4-active')) {
            activeScrollInstance.closeModal();
            return; // Dừng lại sau khi đóng modal
        }

        // 2. Logic điều hướng bằng phím mũi tên
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const { track, cards } = activeScrollInstance;

            // Kiểm tra nếu modal đang mở thì không cho cuộn
            if (activeScrollInstance.modalOverlay.classList.contains('id4-guide-active', 'id4-active')) return;

            e.preventDefault();

            const scrollableDistance = track.offsetHeight - window.innerHeight;
            const progressPerCard = 1 / (cards.length - 1);
            const currentScroll = window.scrollY - track.offsetTop;
            const currentProgress = currentScroll / scrollableDistance;
            const currentIndex = Math.round(currentProgress / progressPerCard);

            let targetIndex = currentIndex;
            if (e.key === 'ArrowRight') {
                targetIndex = Math.min(cards.length - 1, currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                targetIndex = Math.max(0, currentIndex - 1);
            }

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