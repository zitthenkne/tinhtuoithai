/**
 * ============================================================================
 * CHRONO-OBSTETRIX BREAKTHROUGH CLINICAL TOOLS SUITE
 * 1. OSCE Exam Generator & 5-Minute Timer
 * 2. Visual Arbitration Engine (LMP vs CRL)
 * 3. Anatomical BCTC Slider & Johnson Fetal Weight
 * 4. Perinatal Journey Tracker & Fruit Size Analogy
 * 5. Conception & Implantation Window Calculator
 * 6. One-Click Clinical Note Exporter
 * 7. Tactile Audio Click & Clay Confetti Fireworks
 * 8. Examiner Trap FAQ (Clinical Pearls)
 * Rule: Zero em-dashes.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChronoTools = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var Clinical = window.ChronoClinical;

  // 1. AUDIO SYNTHESIZER FOR WHEEL TICK
  var audioCtx = null;
  function playTickSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio autoplay restrictions
    }
  }

  // 2. CELEBRATORY CLAY CONFETTI
  function launchConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }

    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var colors = ['#FDA4AF', '#FB7185', '#F43F5E', '#FDE047', '#6EE7B7', '#A78BFA'];
    var particles = [];
    for (var i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    var startTime = performance.now();
    function render(now) {
      var progress = (now - startTime) / 1600;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vr;
        p.alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        // Draw round soft clay circle or rounded squircle
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (progress < 1) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(render);
  }

  // 3. BABY FRUIT / VEGETABLE SIZE ANALOGY
  var FRUIT_SIZES = [
    { weeks: 4, name: 'Hạt mè (Hạt vừng)', emoji: '🌱' },
    { weeks: 6, name: 'Hạt đậu lăng', emoji: '🫘' },
    { weeks: 8, name: 'Quả phúc bồn tử (Mâm xôi)', emoji: '🫐' },
    { weeks: 10, name: 'Quả mận xanh (Dâu tây)', emoji: '🍓' },
    { weeks: 12, name: 'Quả chanh vàng (Lemon)', emoji: '🍋' },
    { weeks: 14, name: 'Quả đào tiên (Peach)', emoji: '🍑' },
    { weeks: 16, name: 'Quả bơ (Avocado)', emoji: '🥑' },
    { weeks: 18, name: 'Củ khoai lang nhỏ', emoji: '🍠' },
    { weeks: 20, name: 'Quả chuối tiêu', emoji: '🍌' },
    { weeks: 22, name: 'Quả đu đủ nhỏ', emoji: '🥭' },
    { weeks: 24, name: 'Bắp ngô ngọt (Bắp Mỹ)', emoji: '🌽' },
    { weeks: 28, name: 'Cà tím lớn (Eggplant)', emoji: '🍆' },
    { weeks: 32, name: 'Quả dừa xiêm', emoji: '🥥' },
    { weeks: 36, name: 'Cây xà lách Romaine lớn', emoji: '🥬' },
    { weeks: 40, name: 'Quả dưa hấu ngọt (Watermelon)', emoji: '🍉' }
  ];

  function getBabySize(weeks) {
    var match = FRUIT_SIZES[0];
    for (var i = 0; i < FRUIT_SIZES.length; i++) {
      if (weeks >= FRUIT_SIZES[i].weeks) {
        match = FRUIT_SIZES[i];
      }
    }
    return match;
  }

  // 4. OSCE EXAM CASE GENERATOR & TIMER
  var sampleCases = [
    {
      title: 'Đề 1: Thai phụ kinh nguyệt đều',
      patient: 'Sản phụ Nguyễn Thị H., 26 tuổi, PARA 0000. Đến khám thai lần đầu. Kỳ kinh cuối ngày 05/02/2026. Chu kỳ kinh 28 ngày, nhớ rõ ngày đầu, không dùng thuốc tránh thai.',
      lmp: '2026-02-05',
      crl: null,
      exam: '2026-05-14',
      task: 'Hãy tính ngày dự sinh theo Naegele, tuổi thai hiện tại và cho biết xét nghiệm sàng lọc dị tật cần làm.',
      solution: 'Dự sinh Naegele: 12/11/2026. Tuổi thai: 14 tuần 0 ngày. Cần làm Double Test / Combined Test hoặc NIPT để sàng lọc bất thường NST.'
    },
    {
      title: 'Đề 2: Kỳ kinh không đều đối chiếu siêu âm CRL',
      patient: 'Sản phụ Trần Thị M., 31 tuổi, PARA 1001. Kinh nguyệt thất thường (35-50 ngày). Khám ngày 20/06/2026 mang theo phiếu siêu âm ngày 20/06/2026 có CRL = 54 mm.',
      lmp: '2026-03-10',
      crl: 54,
      exam: '2026-06-20',
      task: 'Xác định căn cứ pháp lý để tính ngày dự sinh và tính tuổi thai hiện tại.',
      solution: 'Kỳ kinh không đều nên LMP không tin cậy. Bắt buộc lấy siêu âm quý 1 làm chuẩn. Theo công thức Thầy Luân: Tuổi thai = 42 + 54 = 96 ngày (13 tuần 5 ngày). Dự sinh tính theo siêu âm.'
    },
    {
      title: 'Đề 3: Thụ tinh ống nghiệm IVF phôi ngày 5',
      patient: 'Sản phụ Lê Ngọc T., 34 tuổi, vô sinh 4 năm. Làm IVF chuyển 01 phôi ngày 5 vào ngày 10/04/2026. Khám ngày 15/06/2026 siêu âm thai tương đương 10 tuần 2 ngày.',
      lmp: null,
      ivfDate: '2026-04-10',
      ivfType: 'day5',
      exam: '2026-06-15',
      task: 'Xác định ngày dự sinh chính thức. Bác sĩ siêu âm đề nghị sửa dự sinh theo kích thước thai, bạn xử trí thế nào?',
      solution: 'Trong IVF, tuổi thai tính theo ngày chuyển phôi là chuẩn tuyệt đối: 66 ngày + 19 ngày = 85 ngày (12 tuần 1 ngày). TUYỆT ĐỐI KHÔNG SỬA DỰ SINH. Thai nhỏ là dấu hiệu FGR sớm.'
    }
  ];

  var timerInterval = null;
  var timerSecondsLeft = 300; // 5 minutes

  function startTimer(onTick, onEnd) {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (timerSecondsLeft > 0) {
        timerSecondsLeft--;
        if (typeof onTick === 'function') onTick(timerSecondsLeft);
      } else {
        clearInterval(timerInterval);
        if (typeof onEnd === 'function') onEnd();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerSecondsLeft = 300;
  }

  // 5. COPY MEDICAL SUMMARY CARD
  function exportClinicalSummary(data) {
    var text = [
      '========================================',
      'PHIẾU TỔNG KẾT KHÁM THAI & ĐỊNH TUỔI THAI',
      '========================================',
      'Ngày khám: ' + data.examDate,
      'Tuổi thai chính thức: ' + data.gaText,
      'Ngày dự sinh (EDD 40 tuần): ' + data.eddText,
      'Căn cứ pháp lý: ' + data.legalBasis,
      'Giai đoạn thai kỳ: ' + data.trimester,
      'Bề cao tử cung (BCTC): ' + data.bctcText,
      'Kỳ kinh chót (LMP): ' + (data.lmpText || 'Không xác định / Quy đổi'),
      'Ghi chú sàng lọc tiếp theo: ' + data.nextMilestone,
      '----------------------------------------',
      '© Việt Thanh - Y23C - 17 | Ứng dụng Tính Tuổi Thai'
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      return Promise.reject(new Error('Clipboard API unavailable'));
    }
  }

  // Public Interface
  return {
    playTickSound: playTickSound,
    launchConfetti: launchConfetti,
    getBabySize: getBabySize,
    sampleCases: sampleCases,
    startTimer: startTimer,
    resetTimer: resetTimer,
    exportClinicalSummary: exportClinicalSummary
  };
});
