const videoLink = "https://cms.allon4plus.com.au/assets/img/AllOn4PlusWebsite_Handbrake.mp4";

const videoData = [{
    thumb: videoLink,
    full: videoLink,
    title: "MHDPT MẤT NHIỀU RĂNG"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "MHDPT MẤT RĂNG ĐƠN LẺ"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "QUY TRÌNH CẤY IMPLANT VỚI MHDPT"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "QUY TRÌNH SẢN XUẤT MHDPT"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "HƯỚNG DẪN SỬ DỤNG"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "CÁC CA LÂM SÀNG"
}, {
    thumb: videoLink,
    full: videoLink,
    title: "ĐÀO TẠO IMPLANT TOÀN HÀM"
}];

const gallery = document.querySelector('.video-gallery');
const modal = document.getElementById('video-modal');
const modalContent = document.querySelector('.modal-content');
const modalVideo = document.getElementById('modal-video');
const progressContainer = document.querySelector('.modal-progress-container');
const galleryContainer = document.querySelector('.gallery-container');
let currentVideoIndex = 0;

function createGalleryItems() {
    videoData.forEach((data, index) => {
        const item = document.createElement('li');
        item.className = 'gallery-item';
        item.setAttribute('data-index', index);

        const video = document.createElement('video');
        video.src = data.thumb + '#t=0.5';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";

        if (index === 0) {
            video.autoplay = true;
        }

        const textOverlay = document.createElement('div');
        textOverlay.className = 'item-overlay';
        textOverlay.innerHTML = data.title;

        const playButton = document.createElement('div');
        playButton.className = 'play-button-overlay';
        playButton.innerHTML = `<div class="play-icon"></div><div class="expand-icon"></div>`;

        const mobileTitle = document.createElement('div');
        mobileTitle.className = 'mobile-title';
        mobileTitle.innerHTML = data.title;


        item.append(video, playButton, textOverlay, mobileTitle);
        gallery.appendChild(item);

        const progressSegment = document.createElement('div');
        progressSegment.className = 'progress-segment';
        progressSegment.innerHTML = `<div class="progress-fill"></div>`;
        progressContainer.appendChild(progressSegment);
    });
}

function resizeModalToFitVideo() {
    const videoRatio = modalVideo.videoWidth / modalVideo.videoHeight;
    const screenHeight = window.innerHeight * 0.75;
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

// ========= HÀM ĐÃ ĐƯỢC CẬP NHẬT TẠI ĐÂY =========

// !!! THAY ĐỔI 'header' cho đúng với selector menu trên trang của bạn.
const header = document.querySelector('header');
let originalHeaderZIndex = ''; // Biến để lưu z-index gốc


function openModal(index) {

    // Di chuyển modal ra làm con trực tiếp của body để thoát khỏi stacking context
    document.body.appendChild(modal);

    // *** LOGIC MỚI BẮT ĐẦU TẠI ĐÂY ***
    // Kiểm tra xem có tìm thấy header không
    if (header) {
        // Lưu lại z-index hiện tại của header (nếu có)
        originalHeaderZIndex = window.getComputedStyle(header).zIndex;
        // Tạm thời hạ z-index của header xuống để modal nổi lên
        header.style.zIndex = '0';
    }
    // *** LOGIC MỚI KẾT THÚC ***

    currentVideoIndex = index;
    modalVideo.src = videoData[index].full;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const segments = document.querySelectorAll('.progress-segment');
    segments.forEach((seg, i) => {
        seg.classList.toggle('active', i === index);
        seg.querySelector('.progress-fill').style.width = i < index ? '100%' : '0%';
    });
}
// ===============================================

function closeModal() {
    modal.classList.remove('show');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
    modalContent.style.width = 'auto';
    modalContent.style.height = 'auto';

    // *** LOGIC MỚI BẮT ĐẦU TẠI ĐÂY ***
    // Khôi phục lại z-index ban đầu cho header
    if (header) {
        header.style.zIndex = originalHeaderZIndex;
    }
    // *** LOGIC MỚI KẾT THÚC ***
}

function showNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoData.length;
    openModal(currentVideoIndex);
}

function showPrevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoData.length) % videoData.length;
    openModal(currentVideoIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    createGalleryItems();

    const items = document.querySelectorAll('.gallery-item');
    const firstVideo = items.length > 0 ? items[0].querySelector('video') : null;

    if (window.innerWidth > 768 && firstVideo) {
        items.forEach(item => {
            const video = item.querySelector('video');

            item.addEventListener('mouseenter', () => {
                firstVideo.pause();
                video.play();
            });

            item.addEventListener('mouseleave', () => {
                video.pause();
            });
        });

        galleryContainer.addEventListener('mouseleave', () => {
            firstVideo.play();
        });
    }

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            const index = parseInt(item.getAttribute('data-index'));
            openModal(index);
        }
    });

    modalVideo.addEventListener('loadedmetadata', resizeModalToFitVideo);
    modalVideo.addEventListener('timeupdate', updateProgressBar);
    modalVideo.addEventListener('ended', showNextVideo);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});