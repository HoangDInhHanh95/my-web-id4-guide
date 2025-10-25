/* ======================================================================= */
/* KHỐI 1: DỮ LIỆU VÀ BIẾN                                                */
/* ======================================================================= */
const videoLink = "https://stories.join-stories.com/asus-hq/ec4c7026-99a2-4813-b330-f2e863f34f76/story.mp4";
const videoData = [{
    thumb: videoLink,
    full: videoLink,
    title: "Inside the Box 🔒"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "Feel the design"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "Motion Brief ♾️"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "Watch the film"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "Styled with Beige 🏃"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "Cool with Gray 🏃"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "More Features"
}];

const gallery = document.querySelector('.video-gallery');
const modal = document.getElementById('video-modal');
const modalContent = document.querySelector('.modal-content');
const modalVideo = document.getElementById('modal-video');
const progressContainer = document.querySelector('.modal-progress-container');
const galleryContainer = document.querySelector('.gallery-container');
let currentVideoIndex = 0;
let touchStartX = 0;

/* ======================================================================= */
/* KHỐI 2: CÁC HÀM CHÍNH                                                 */
/* ======================================================================= */

function createGalleryItems() {
    videoData.forEach((data, index) => {
        const item = document.createElement('li');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);
        item.setAttribute('tabindex', '0');

        const video = document.createElement('video');
        video.setAttribute('data-src', data.thumb + '#t=0.5');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";

        if (index === 0) {
            video.autoplay = true;
        }

        const textOverlay = document.createElement('div');
        textOverlay.className = 'item-overlay';
        textOverlay.innerHTML = data.title;

        const playButton = document.createElement('div');
        playButton.className = 'play-button-overlay';
        playButton.innerHTML = `<div class="play-icon"></div><div class="expand-icon"></div>`;

        item.append(video, playButton, textOverlay);
        gallery.appendChild(item);

        const progressSegment = document.createElement('div');
        progressSegment.className = 'progress-segment';
        progressSegment.innerHTML = `<div class="progress-fill"></div>`;
        progressContainer.appendChild(progressSegment);
    });
}

function openModal(index) {
    currentVideoIndex = index;
    modal.classList.add('loading');
    modalVideo.src = videoData[index].full;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const segments = document.querySelectorAll('.progress-segment');
    segments.forEach((seg, i) => {
        seg.classList.toggle('active', i === index);
        seg.querySelector('.progress-fill').style.width = i < index ? '100%' : '0%';
    });
    trapFocus(modal);
}

function closeModal() {
    modal.classList.remove('show');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
    modalContent.style.width = 'auto';
    modalContent.style.height = 'auto';
    const focusedItem = gallery.querySelector(`[data-index="${currentVideoIndex}"]`);
    if (focusedItem) focusedItem.focus();
}

function resizeModalToFitVideo() {
    const videoRatio = modalVideo.videoWidth / modalVideo.videoHeight;
    const screenHeight = window.innerHeight * 0.95;
    const screenWidth = window.innerWidth * 0.95;
    let newWidth = screenWidth;
    let newHeight = newWidth / videoRatio;
    if (newHeight > screenHeight) {
        newHeight = screenHeight;
        newWidth = newHeight * videoRatio;
    }
    modalContent.style.width = `${newWidth}px`;
    modalContent.style.height = `${newHeight}px`;
}

function updateProgressBar() {
    const percent = (modalVideo.currentTime / modalVideo.duration) * 100;
    const progressFills = document.querySelectorAll('.progress-fill');
    if (progressFills[currentVideoIndex]) {
        progressFills[currentVideoIndex].style.width = `${percent}%`;
    }
}

function showNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoData.length;
    openModal(currentVideoIndex);
}

function showPrevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoData.length) % videoData.length;
    openModal(currentVideoIndex);
}

/* ======================================================================= */
/* KHỐI 3: CÁC CHỨC NĂNG NÂNG CAO                                         */
/* ======================================================================= */

function setupLazyLoader() {
    const lazyVideos = document.querySelectorAll('video[data-src]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.getAttribute('data-src');
                video.addEventListener('loadeddata', () => video.classList.add('loaded'));
                observer.unobserve(video);
            }
        });
    });
    lazyVideos.forEach(video => observer.observe(video));
    if (lazyVideos[0]) {
        lazyVideos[0].src = lazyVideos[0].getAttribute('data-src');
        lazyVideos[0].addEventListener('loadeddata', () => lazyVideos[0].classList.add('loaded'));
        observer.unobserve(lazyVideos[0]);
    }
}

function setupKeyboardNavigation() {
    gallery.addEventListener('keydown', (e) => {
        const items = Array.from(gallery.querySelectorAll('.gallery-item'));
        const currentIndex = items.indexOf(document.activeElement);
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            items[prevIndex].focus();
        } else if (e.key === 'Enter') {
            if (currentIndex !== -1) {
                openModal(currentIndex);
            }
        }
    });
}

function trapFocus(element) {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    element.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
    firstFocusableElement.focus();
}

function setupSwipeGestures() {
    modalContent.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX, {
        passive: true
    });
    modalContent.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 50) {
            showPrevVideo();
        } else if (swipeDistance < -50) {
            showNextVideo();
        }
    }, {
        passive: true
    });
}

/* ======================================================================= */
/* KHỐI 4: GẮN SỰ KIỆN                                                   */
/* ======================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    createGalleryItems();

    setupLazyLoader();
    setupKeyboardNavigation();
    setupSwipeGestures();

    const items = document.querySelectorAll('.gallery-item');
    const firstVideo = items.length > 0 ? items[0].querySelector('video') : null;

    if (window.innerWidth > 768 && firstVideo) {
        items.forEach(item => {
            const video = item.querySelector('video');
            item.addEventListener('mouseenter', () => {
                firstVideo.pause();
                video.play().catch(e => console.log("Lỗi tự động phát: ", e));
            });
            item.addEventListener('mouseleave', () => {
                video.pause();
            });
        });
        galleryContainer.addEventListener('mouseleave', () => {
            firstVideo.play().catch(e => console.log("Lỗi tự động phát: ", e));
        });
    }

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) openModal(parseInt(item.getAttribute('data-index')));
    });

    modalVideo.addEventListener('canplay', () => {
        modal.classList.remove('loading');
        resizeModalToFitVideo();
    });
    modalVideo.addEventListener('timeupdate', updateProgressBar);
    modalVideo.addEventListener('ended', showNextVideo);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
});