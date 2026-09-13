/**
 * ============================================================================
 * CHRONO-OBSTETRIX INTERACTIVE SPOTLIGHT TOUR ENGINE
 * Theme: Cute Pastel Peach Claymorphism
 * Feature: Dims screen, focuses spotlight cutout on targets, shows step-by-step
 *          guidance popover with smooth navigation.
 * Rule: Zero em-dashes.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChronoTour = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var tourSteps = [
    {
      targetId: 'onwheel-coach-card',
      title: '1. Chỉ dẫn xoay & đọc trực tiếp trên vòng',
      content: 'Rèn luyện phản xạ phòng thi thực tế khi không được dùng điện thoại: Hướng dẫn chi tiết cách đặt tay xoay mốc, mắt dóng tia nào để đọc ngày dự sinh và tuổi thai chuẩn xác!',
      placement: 'bottom'
    },
    {
      targetId: 'pregnancy-wheel-container',
      title: '2. Vòng xoay quang học & Thước ngắm Laser',
      content: 'Đĩa ngoài là vành lịch 365 ngày. Đĩa trong là 40 tuần thai. Khi bấm từng bước chỉ dẫn, các tia laser màu và vạch phát sáng sẽ hiện trực tiếp trên mặt vòng để hướng dẫn mắt nhìn!',
      placement: 'bottom'
    },
    {
      targetId: 'btn-toggle-sightlines',
      title: '3. Thước ngắm Laser & Chế độ Thi thật',
      content: 'Bật Thước ngắm Laser để thấy các tia dóng thẳng hàng khi xoay, hoặc bật Chế độ Thi thật (ẩn số điện tử) để tự nhìn vạch trên thước đọc kết quả.',
      placement: 'bottom'
    },
    {
      targetId: 'clinical-form',
      title: '4. Bảng nhập liệu lâm sàng chuẩn xác',
      content: 'Bà có thể tự nhập bất kỳ đề bài nào của mình: chọn ngày khám, ngày kinh chót, tích kiểm 4 tiêu chuẩn kinh nguyệt hoặc chuyển mode Siêu âm CRL / IVF.',
      placement: 'top'
    },
    {
      targetId: 'readout-ga-primary',
      title: '5. Thẻ kết quả Hero Readout to rõ',
      content: 'Hiển thị tuổi thai chính thức, ngày dự sinh, giai đoạn thai kỳ, căn cứ pháp lý và ước tính bề cao tử cung (BCTC) theo thời gian thực.',
      placement: 'bottom'
    },
    {
      targetId: 'quiz-simulator',
      title: '6. Bộ luyện thi OSCE trạm 1 & Đồng hồ 5 phút',
      content: 'Sinh đề thi ngẫu nhiên, bấm đồng hồ 5 phút chuẩn trạm thi và mở đáp án kèm hiệu ứng pháo hoa đất sét chúc mừng.',
      placement: 'top'
    }
  ];

  function SpotlightTour() {
    this.currentStep = 0;
    this.overlay = null;
    this.spotlightBox = null;
    this.popover = null;
    this.isActive = false;
  }

  SpotlightTour.prototype.init = function () {
    if (document.getElementById('tour-overlay')) return;

    // Overlay element
    this.overlay = document.createElement('div');
    this.overlay.id = 'tour-overlay';
    this.overlay.className = 'tour-backdrop';
    document.body.appendChild(this.overlay);

    // Spotlight Highlight Box
    this.spotlightBox = document.createElement('div');
    this.spotlightBox.id = 'tour-spotlight-box';
    this.spotlightBox.className = 'tour-spotlight-cutout';
    document.body.appendChild(this.spotlightBox);

    // Popover Card
    this.popover = document.createElement('div');
    this.popover.id = 'tour-popover-card';
    this.popover.className = 'tour-popover-clay';
    this.popover.innerHTML = [
      '<div class="tour-popover-header">',
      '  <span class="tour-badge-step" id="tour-step-badge">Bước 1/7</span>',
      '  <button type="button" class="tour-btn-close" id="tour-btn-close" aria-label="Đóng">&times;</button>',
      '</div>',
      '<h4 class="tour-popover-title" id="tour-step-title">Tiêu đề bước</h4>',
      '<p class="tour-popover-text" id="tour-step-text">Nội dung hướng dẫn...</p>',
      '<div class="tour-popover-actions">',
      '  <button type="button" class="tour-btn tour-btn-prev" id="tour-btn-prev">Quay lại</button>',
      '  <button type="button" class="tour-btn tour-btn-next" id="tour-btn-next">Tiếp tục</button>',
      '</div>'
    ].join('');
    document.body.appendChild(this.popover);

    // Event listeners
    var self = this;
    document.getElementById('tour-btn-close').addEventListener('click', function () {
      self.stop();
    });
    document.getElementById('tour-btn-prev').addEventListener('click', function () {
      self.prev();
    });
    document.getElementById('tour-btn-next').addEventListener('click', function () {
      self.next();
    });
    this.overlay.addEventListener('click', function () {
      self.stop();
    });

    window.addEventListener('resize', function () {
      if (self.isActive) self.updatePosition();
    });
  };

  SpotlightTour.prototype.start = function () {
    this.init();
    this.isActive = true;
    this.currentStep = 0;
    this.overlay.classList.add('active');
    this.spotlightBox.classList.add('active');
    this.popover.classList.add('active');
    this.showStep(0);
  };

  SpotlightTour.prototype.stop = function () {
    this.isActive = false;
    if (this.overlay) this.overlay.classList.remove('active');
    if (this.spotlightBox) this.spotlightBox.classList.remove('active');
    if (this.popover) this.popover.classList.remove('active');
  };

  SpotlightTour.prototype.next = function () {
    if (this.currentStep < tourSteps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.stop();
    }
  };

  SpotlightTour.prototype.prev = function () {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  };

  SpotlightTour.prototype.showStep = function (index) {
    var step = tourSteps[index];
    if (!step) return;

    var el = document.getElementById(step.targetId);
    if (!el) return;

    // Update Popover Copy
    document.getElementById('tour-step-badge').textContent = 'Bước ' + (index + 1) + '/' + tourSteps.length;
    document.getElementById('tour-step-title').textContent = step.title;
    document.getElementById('tour-step-text').textContent = step.content;

    var prevBtn = document.getElementById('tour-btn-prev');
    var nextBtn = document.getElementById('tour-btn-next');
    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    nextBtn.textContent = index === tourSteps.length - 1 ? 'Hoàn tất' : 'Tiếp tục';

    // Scroll into view smoothly
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    var self = this;
    setTimeout(function () {
      self.updatePosition();
    }, 250);
  };

  SpotlightTour.prototype.updatePosition = function () {
    var step = tourSteps[this.currentStep];
    if (!step) return;

    var el = document.getElementById(step.targetId);
    if (!el) return;

    var rect = el.getBoundingClientRect();
    var padding = 8;

    // Update spotlight box around target
    this.spotlightBox.style.top = (rect.top - padding) + 'px';
    this.spotlightBox.style.left = (rect.left - padding) + 'px';
    this.spotlightBox.style.width = (rect.width + padding * 2) + 'px';
    this.spotlightBox.style.height = (rect.height + padding * 2) + 'px';

    // Position Popover Card
    var popWidth = Math.min(window.innerWidth - 32, 360);
    var popTop = rect.bottom + 16;
    var popLeft = rect.left + (rect.width - popWidth) / 2;

    if (popLeft < 16) popLeft = 16;
    if (popLeft + popWidth > window.innerWidth - 16) {
      popLeft = window.innerWidth - popWidth - 16;
    }

    if (popTop + 240 > window.innerHeight) {
      popTop = Math.max(16, rect.top - 240);
    }

    this.popover.style.width = popWidth + 'px';
    this.popover.style.top = popTop + 'px';
    this.popover.style.left = popLeft + 'px';
  };

  return new SpotlightTour();
});
