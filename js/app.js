/**
 * ============================================================================
 * CHRONO-OBSTETRIX APPLICATION CONTROLLER (ENHANCED BREAKTHROUGH EDITION)
 * Features: Two-Way Wheel Sync, Spotlight Onboarding Tour, OSCE Quiz Simulator,
 *           Fruit Size Analogy, Magnifier Zoom, Export Note & Tactile Feedback
 * Rule: Zero em-dashes.
 * ============================================================================
 */

(function () {
  'use strict';

  var Clinical = window.ChronoClinical;
  var Wheel = window.ChronoWheel;
  var Tour = window.ChronoTour;
  var Tools = window.ChronoTools;

  if (!Clinical || !Wheel) {
    console.error('ChronoApp: Core engines missing.');
    return;
  }

  // Application State
  var state = {
    mode: 'lmp',
    examDate: new Date(),
    lmpDate: null,
    lmpCriteria: {
      regularCycle: true,
      exactRecall: true,
      noHormones: true,
      noLactation: true
    },
    crlMm: 45,
    crlDate: null,
    ivfDate: null,
    ivfType: 'day5',
    eddDate: null,
    bctcCm: '',
    isHeadEngaged: false,
    activeScenario: 'case1',
    isZoomed: false,
    currentQuizIndex: 0,
    isTimerRunning: false,
    onwheelScenario: 'case1',
    onwheelStep: 1,
    sightlinesEnabled: true,
    blindModeEnabled: false
  };

  // DOM Cache
  var dom = {};
  var wheelInstance = null;

  function queryElements() {
    dom.modeTabs = document.querySelectorAll('.mode-tab-btn');
    dom.modeSections = document.querySelectorAll('.mode-form-section');

    // Header buttons
    dom.btnStartTour = document.getElementById('btn-start-tour');
    dom.btnExportNote = document.getElementById('btn-export-note');
    dom.toastMsg = document.getElementById('toast-msg');

    // Wheel Zoom
    dom.btnZoomWheel = document.getElementById('btn-zoom-wheel');
    dom.wheelContainer = document.getElementById('pregnancy-wheel-container');

    // On-Wheel Coach
    dom.onwheelCard = document.getElementById('onwheel-coach-card');
    dom.scenarioTabs = document.querySelectorAll('.btn-scenario-tab');
    dom.onwheelStepBtns = document.querySelectorAll('.btn-onwheel-step');
    dom.instructionHands = document.getElementById('instruction-hands');
    dom.instructionEyes = document.getElementById('instruction-eyes');
    dom.instructionQuote = document.getElementById('instruction-quote');
    dom.btnToggleSightlines = document.getElementById('btn-toggle-sightlines');
    dom.labelSightlines = document.getElementById('label-sightlines');
    dom.btnToggleBlind = document.getElementById('btn-toggle-blind');
    dom.labelBlind = document.getElementById('label-blind');
    dom.btnAutoAlign = document.getElementById('btn-auto-align');

    // Mobile Navigation
    dom.appWorkspace = document.getElementById('app-workspace');
    dom.mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    dom.btnToggleCoach = document.getElementById('btn-toggle-coach');
    dom.btnJumpToWheel = document.getElementById('btn-jump-to-wheel');

    // Inputs
    dom.inputExamDate = document.getElementById('input-exam-date');
    dom.inputBctc = document.getElementById('input-bctc');
    dom.inputHeadEngaged = document.getElementById('input-head-engaged');

    // LMP
    dom.inputLmpDate = document.getElementById('input-lmp-date');
    dom.cbRegularCycle = document.getElementById('cb-regular-cycle');
    dom.cbExactRecall = document.getElementById('cb-exact-recall');
    dom.cbNoHormones = document.getElementById('cb-no-hormones');
    dom.cbNoLactation = document.getElementById('cb-no-lactation');
    dom.lmpWarningCallout = document.getElementById('lmp-warning-callout');
    dom.btnSwitchCrl = document.getElementById('btn-switch-crl');

    // CRL
    dom.inputCrlMm = document.getElementById('input-crl-mm');
    dom.inputCrlDate = document.getElementById('input-crl-date');

    // IVF
    dom.inputIvfDate = document.getElementById('input-ivf-date');
    dom.selectIvfType = document.getElementById('select-ivf-type');

    // Reverse
    dom.inputEddDate = document.getElementById('input-edd-date');

    // Hero Metric Readouts
    dom.readoutGA = document.getElementById('readout-ga-primary');
    dom.readoutGASub = document.getElementById('readout-ga-sub');
    dom.readoutEDD = document.getElementById('readout-edd');
    dom.readoutStage = document.getElementById('readout-stage');
    dom.readoutBCTC = document.getElementById('readout-bctc');
    dom.badgeLegalBasis = document.getElementById('badge-legal-basis');

    // Baby Fruit Card
    dom.babyFruitEmoji = document.getElementById('baby-fruit-emoji');
    dom.babySizeWeekLabel = document.getElementById('baby-size-week-label');
    dom.babyFruitName = document.getElementById('baby-fruit-name');
    dom.babyCountdownBadge = document.getElementById('baby-countdown-badge');

    // Wheel Controls
    dom.wheelStatusAngle = document.getElementById('wheel-status-angle');
    dom.wheelStatusLmp = document.getElementById('wheel-status-lmp');
    dom.btnSyncWheel = document.getElementById('btn-sync-wheel');
    dom.btnTodayWheel = document.getElementById('btn-today-wheel');
    dom.btnResetWheel = document.getElementById('btn-reset-wheel');

    // Tutorial & Scenarios
    dom.btnCase1 = document.getElementById('btn-case-1');
    dom.btnCase2 = document.getElementById('btn-case-2');
    dom.btnCase3 = document.getElementById('btn-case-3');
    dom.btnDemoSpin = document.getElementById('btn-demo-spin');
    dom.scenarioButtons = document.querySelectorAll('.btn-scenario');
    dom.scenarioBannerTitle = document.getElementById('scenario-banner-title');
    dom.scenarioBannerText = document.getElementById('scenario-banner-text');

    // OSCE Quiz Simulator
    dom.quizCaseTitle = document.getElementById('quiz-case-title');
    dom.quizPatientPrompt = document.getElementById('quiz-patient-prompt');
    dom.quizTaskPrompt = document.getElementById('quiz-task-prompt');
    dom.quizSolutionBox = document.getElementById('quiz-solution-box');
    dom.quizSolutionText = document.getElementById('quiz-solution-text');
    dom.quizTimerDisplay = document.getElementById('quiz-timer-display');
    dom.btnNextQuiz = document.getElementById('btn-next-quiz');
    dom.btnStartTimer = document.getElementById('btn-start-timer');
    dom.btnShowSolution = document.getElementById('btn-show-solution');
    dom.btnApplyQuizData = document.getElementById('btn-apply-quiz-data');

    // OSCE Coach
    dom.coachLmpStatus = document.getElementById('coach-lmp-status');
    dom.coachNaegeleSteps = document.getElementById('coach-naegele-steps');
    dom.coachCrlArbitration = document.getElementById('coach-crl-arbitration');
    dom.coachIvfTrap = document.getElementById('coach-ivf-trap');
    dom.coachMilestones = document.getElementById('coach-milestones');

    // Rubric
    dom.rubricCheckboxes = document.querySelectorAll('.rubric-checkbox');
    dom.rubricTotalScore = document.getElementById('rubric-total-score');
    dom.rubricFeedbackBadge = document.getElementById('rubric-feedback-badge');
  }

  function setInitialDates() {
    var today = new Date();
    state.examDate = today;

    var defaultLMP = Clinical.addDays(today, -84);
    state.lmpDate = defaultLMP;
    state.crlDate = today;
    state.crlMm = 45;
    state.ivfDate = Clinical.addDays(today, -65);
    state.eddDate = Clinical.addDays(defaultLMP, 280);

    if (dom.inputExamDate) dom.inputExamDate.value = Clinical.toInputDate(state.examDate);
    if (dom.inputLmpDate) dom.inputLmpDate.value = Clinical.toInputDate(state.lmpDate);
    if (dom.inputCrlDate) dom.inputCrlDate.value = Clinical.toInputDate(state.crlDate);
    if (dom.inputCrlMm) dom.inputCrlMm.value = state.crlMm;
    if (dom.inputIvfDate) dom.inputIvfDate.value = Clinical.toInputDate(state.ivfDate);
    if (dom.inputEddDate) dom.inputEddDate.value = Clinical.toInputDate(state.eddDate);
  }

  function switchMode(newMode) {
    state.mode = newMode;

    dom.modeTabs.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === newMode);
    });

    dom.modeSections.forEach(function (sec) {
      sec.style.display = (sec.getAttribute('data-section') === newMode) ? 'flex' : 'none';
    });

    recalculate();
  }

  function showToast(msg) {
    if (!dom.toastMsg) return;
    dom.toastMsg.textContent = msg;
    dom.toastMsg.classList.add('show');
    setTimeout(function () {
      dom.toastMsg.classList.remove('show');
    }, 2800);
  }

  /**
   * On-Wheel Direct Clinical Coach Engine
   */
  function getScenarioGuideData(scenarioKey) {
    if (scenarioKey === 'case1') {
      return {
        scenarioType: 'lmp',
        targetCalendarDate: new Date(2026, 1, 10), // 10/02/2026
        lmpDate: new Date(2026, 1, 10),
        eddDate: new Date(2026, 10, 17), // 17/11/2026
        examDate: new Date(2026, 5, 15), // 15/06/2026
        gaWeeks: 18,
        gaDays: 0,
        gaTotalDays: 125,
        milestoneTitle: 'Siêu âm khảo sát hình thái học thai chi tiết',
        milestoneRange: '18 - 22 tuần'
      };
    } else if (scenarioKey === 'case2') {
      return {
        scenarioType: 'crl',
        crlMm: 45,
        crlGADays: 87, // 12w 3d
        crlDate: new Date(2026, 2, 12), // 12/03/2026
        targetCalendarDate: new Date(2026, 2, 12),
        eddDate: new Date(2026, 8, 24), // 24/09/2026
        examDate: new Date(2026, 5, 15), // 15/06/2026
        gaWeeks: 25,
        gaDays: 6,
        gaTotalDays: 181,
        milestoneTitle: 'Nghiệm pháp dung nạp 75g Glucose (OGTT)',
        milestoneRange: '24 - 28 tuần'
      };
    } else if (scenarioKey === 'case3') {
      return {
        scenarioType: 'ivf',
        ivfDate: new Date(2026, 1, 20), // 20/02/2026
        ivfType: 'day5',
        ivfAgeDays: 19, // 2w 5d
        targetCalendarDate: new Date(2026, 1, 20),
        eddDate: new Date(2026, 10, 8), // 08/11/2026
        examDate: new Date(2026, 5, 15), // 15/06/2026
        gaWeeks: 19,
        gaDays: 1,
        gaTotalDays: 134,
        milestoneTitle: 'Hình thái học quý 2 & Tiêm uốn ván',
        milestoneRange: '18 - 22 tuần'
      };
    } else {
      var lmp = state.lmpDate || new Date();
      var eddObj = state.eddDate ? { eddDate: state.eddDate } : (Clinical.calculateNaegele(lmp) || { eddDate: new Date() });
      var ga = Clinical.calculateGAFromDates(lmp, state.examDate) || { weeks: 12, days: 0, totalDays: 84 };
      return {
        scenarioType: state.mode,
        targetCalendarDate: (state.mode === 'crl' ? (state.crlDate || new Date()) : (state.mode === 'ivf' ? (state.ivfDate || new Date()) : lmp)),
        lmpDate: lmp,
        crlDate: state.crlDate,
        crlMm: state.crlMm,
        crlGADays: 42 + (state.crlMm || 45),
        ivfDate: state.ivfDate,
        ivfType: state.ivfType,
        ivfAgeDays: state.ivfType === 'day3' ? 17 : 19,
        eddDate: eddObj.eddDate,
        examDate: state.examDate,
        gaWeeks: ga.weeks,
        gaDays: ga.days,
        gaTotalDays: ga.totalDays,
        milestoneTitle: 'Theo dõi thai kỳ chuẩn',
        milestoneRange: 'Tùy tuổi thai'
      };
    }
  }

  function updateOnWheelCoach(scenarioKey, stepNum) {
    if (scenarioKey) state.onwheelScenario = scenarioKey;
    if (stepNum) state.onwheelStep = stepNum;

    var guideData = getScenarioGuideData(state.onwheelScenario);

    if (dom.scenarioTabs) {
      dom.scenarioTabs.forEach(function (tab) {
        tab.classList.toggle('active', tab.getAttribute('data-scenario') === state.onwheelScenario);
      });
    }

    if (dom.onwheelStepBtns) {
      dom.onwheelStepBtns.forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-step'), 10) === state.onwheelStep);
      });
    }

    var eddFormatted = Clinical.formatDate(guideData.eddDate);
    var examFormatted = Clinical.formatDate(guideData.examDate);

    if (dom.instructionHands && dom.instructionEyes && dom.instructionQuote) {
      if (state.onwheelStep === 1) {
        if (guideData.scenarioType === 'crl') {
          var crlAgeW = Math.floor(guideData.crlGADays / 7);
          var crlAgeD = guideData.crlGADays % 7;
          dom.instructionHands.innerHTML = '<strong>Thao tác tay (BÍ KÍP SIÊU ÂM):</strong> Khi không có kinh chót, <em>KHÔNG DÙNG MŨI TÊN ĐỎ</em>! Tìm ngày siêu âm (' + Clinical.formatDate(guideData.crlDate).slice(0, 5) + ') trên đĩa ngoài. Xoay vạch <em>' + crlAgeW + ' tuần ' + crlAgeD + ' ngày (42 + 45 = 87 ngày)</em> trên đĩa trong trùng khít vào ngày siêu âm trên đĩa ngoài!';
          dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu:</strong> Nhìn vạch ngày siêu âm trên đĩa ngoài và dóng thẳng hàng vào vạch tuần tuổi thai tương ứng trên đĩa trong. Quan sát mũi tên cong hướng dẫn trên vòng.';
          dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, sản phụ kinh không đều nên siêu âm quý 1 đo CRL 45mm là căn cứ vàng. Em tính tuổi thai lúc siêu âm là 42 + 45 = 87 ngày (' + crlAgeW + 'w' + crlAgeD + 'd) và xoay vạch này trùng khớp ngày siêu âm ' + Clinical.formatDate(guideData.crlDate).slice(0, 5) + '."';
        } else if (guideData.scenarioType === 'ivf') {
          dom.instructionHands.innerHTML = '<strong>Thao tác tay (BÍ KÍP IVF):</strong> Tìm ngày chuyển phôi (' + Clinical.formatDate(guideData.ivfDate).slice(0, 5) + ') trên đĩa ngoài. Phôi ngày 5 cộng 19 ngày quy ước (2 tuần 5 ngày). Xoay vạch <em>2 tuần 5 ngày</em> trên đĩa trong trùng khít vào ngày chuyển phôi trên đĩa ngoài!';
          dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu:</strong> Dóng thẳng hàng vạch 2w5d với vạch ngày chuyển phôi trên đĩa ngoài.';
          dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, thai IVF chuyển phôi ngày 5 nên ngày thụ tinh xác định chính xác. Em cộng 19 ngày quy ước và xoay vạch 2 tuần 5 ngày trùng ngày chuyển phôi ' + Clinical.formatDate(guideData.ivfDate).slice(0, 5) + '."';
        } else {
          dom.instructionHands.innerHTML = '<strong>Thao tác tay trong phòng thi:</strong> Tay trái giữ chặt vành đĩa lịch ngoài (365 ngày). Ngón cái và ngón trỏ tay phải cầm mép đĩa trong, xoay sao cho <em>MŨI TÊN ĐỎ (Đầu kỳ kinh cuối)</em> chỉ chính xác vào vạch ngày ' + Clinical.formatDate(guideData.lmpDate).slice(0, 5) + ' trên đĩa ngoài.';
          dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu:</strong> Nhìn vào vạch phát sáng trên đĩa ngoài và mũi tên đỏ trên đĩa trong. Hãy xoay đĩa theo chiều mũi tên hướng dẫn.';
          dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, sản phụ nhớ rõ ngày đầu kỳ kinh chót ' + Clinical.formatDate(guideData.lmpDate) + ' và kinh nguyệt đều, em đặt mũi tên Đầu kỳ kinh chót trùng khớp ngày ' + Clinical.formatDate(guideData.lmpDate).slice(0, 5) + ' trên vành lịch ngoài."';
        }
      } else if (state.onwheelStep === 2) {
        dom.instructionHands.innerHTML = '<strong>Thao tác tay trong phòng thi:</strong> Giữ chặt thước xoay ở cả hai đĩa, không để bị xê dịch góc quay đã cố định ở Bước 1.';
        dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu (Tia ngắm Xanh):</strong> Nhìn vào <em>MŨI TÊN XANH (DỰ SINH 40 TUẦN)</em> trên đĩa trong, gióng mắt thẳng vuông góc ra đĩa lịch ngoài xem nó đang chỉ vào vạch ngày nào tháng nào.';
        dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, từ mũi tên Dự sinh gióng thẳng ra đĩa ngoài, ngày dự sinh chính thức (EDD 40 tuần) là ngày ' + eddFormatted + '!"';
      } else if (state.onwheelStep === 3) {
        dom.instructionHands.innerHTML = '<strong>Thao tác tay trong phòng thi:</strong> Vẫn giữ nguyên đĩa xoay. Không được xoay lại đĩa!';
        dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu (Tia ngắm Đỏ):</strong> Tìm <em>NGÀY KHÁM HÔM NAY (' + examFormatted.slice(0, 5) + ')</em> trên đĩa ngoài. Từ ngày khám, gióng mắt thẳng vuông góc xuyên vào đĩa trong xem đang thẳng hàng với vạch số mấy trên vòng cung tuần thai.';
        dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, tại ngày khám ' + examFormatted + ' trên đĩa ngoài dóng vào đĩa trong trùng vạch ' + guideData.gaWeeks + ' tuần ' + guideData.gaDays + ' ngày. Tuổi thai hiện tại là ' + guideData.gaWeeks + ' tuần ' + guideData.gaDays + ' ngày!"';
      } else if (state.onwheelStep === 4) {
        dom.instructionHands.innerHTML = '<strong>Thao tác tay trong phòng thi:</strong> Thước đã xác lập xong, đặt thước lên bàn hoặc cầm chắc tay để trình bày kế hoạch quản lý thai.';
        dom.instructionEyes.innerHTML = '<strong>Mắt nhìn đối chiếu:</strong> Quan sát cung màu phát sáng trên chu vi đĩa trong tương ứng với số tuần ' + guideData.gaWeeks + 'w để xác định cửa sổ can thiệp chu sinh.';
        dom.instructionQuote.innerHTML = '<strong>🗣️ Trả lời Giám khảo:</strong> "Thưa Thầy/Cô, thai ' + guideData.gaWeeks + ' tuần nằm trong giai đoạn ' + guideData.milestoneRange + '. Em chỉ định: ' + guideData.milestoneTitle + '!"';
      }
    }

    if (wheelInstance) {
      if (guideData.scenarioType === 'crl') {
        var crlTheoLmp = Clinical.addDays(guideData.crlDate, -guideData.crlGADays);
        wheelInstance.syncWithDate(crlTheoLmp);
      } else if (guideData.scenarioType === 'ivf') {
        var ivfTheoLmp = Clinical.addDays(guideData.ivfDate, -guideData.ivfAgeDays);
        wheelInstance.syncWithDate(ivfTheoLmp);
      } else {
        wheelInstance.syncWithDate(guideData.targetCalendarDate);
      }

      wheelInstance.renderOnWheelGuide(state.onwheelStep, guideData);
      wheelInstance.updateRealtimeSightlines(guideData.examDate);
      wheelInstance.updateReadout(guideData.gaWeeks + 'w ' + guideData.gaDays + 'd', Clinical.formatDate(guideData.eddDate).slice(0, 5));
    }
  }

  /**
   * Practice Scenario Solvers
   */
  function loadScenario(scenarioKey) {
    state.activeScenario = scenarioKey;

    dom.scenarioButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === scenarioKey);
    });

    if (scenarioKey === 'case1') {
      switchMode('lmp');
      var lmp = new Date(2026, 3, 15);
      var exam = new Date(2026, 6, 8);
      state.lmpDate = lmp;
      state.examDate = exam;
      if (dom.inputLmpDate) dom.inputLmpDate.value = Clinical.toInputDate(lmp);
      if (dom.inputExamDate) dom.inputExamDate.value = Clinical.toInputDate(exam);

      if (wheelInstance) wheelInstance.syncWithDate(lmp);

      if (dom.scenarioBannerTitle) {
        dom.scenarioBannerTitle.textContent = 'Đang xem Tình huống 1: Thai tự nhiên theo Kỳ kinh chót (15/04/2026)';
      }
      if (dom.scenarioBannerText) {
        dom.scenarioBannerText.innerHTML =
          '1. Vòng xoay đã tự động đưa <strong>Kim ĐỎ (LMP)</strong> về vạch ngày 15 Tháng 4 trên vành lịch ngoài.<br>' +
          '2. Nhìn theo <strong>Kim XANH (Dự sinh 40w)</strong>: Đang chỉ thẳng vào ngày <strong>22 Tháng 1 năm 2027</strong> theo Naegele.<br>' +
          '3. Tìm ngày khám (08/07) trên vành lịch ngoài và dóng mắt vào đĩa trong: Đọc tuổi thai là <strong>12 tuần 0 ngày (12+0w)</strong>.';
      }

    } else if (scenarioKey === 'case2') {
      switchMode('crl');
      var usDate = new Date(2026, 7, 1);
      state.crlDate = usDate;
      state.examDate = usDate;
      state.crlMm = 45;
      if (dom.inputCrlDate) dom.inputCrlDate.value = Clinical.toInputDate(usDate);
      if (dom.inputExamDate) dom.inputExamDate.value = Clinical.toInputDate(usDate);
      if (dom.inputCrlMm) dom.inputCrlMm.value = 45;

      var theoLmp = Clinical.addDays(usDate, -87);
      if (wheelInstance) wheelInstance.syncWithDate(theoLmp);

      if (dom.scenarioBannerTitle) {
        dom.scenarioBannerTitle.textContent = 'Đang xem Tình huống 2: Siêu âm quý 1 đo CRL = 45 mm (01/08/2026)';
      }
      if (dom.scenarioBannerText) {
        dom.scenarioBannerText.innerHTML =
          '1. Áp dụng công thức Thầy Luân: <strong>Tuổi thai (ngày) = 42 + 45 = 87 ngày (12 tuần 3 ngày)</strong>.<br>' +
          '2. Vòng xoay quy đổi ra ngày kinh chót giả định (05/05/2026) và tự xoay <strong>Kim ĐỎ</strong> vào đó.<br>' +
          '3. Nhìn <strong>Kim XANH (Dự sinh)</strong>: Trỏ vào ngày <strong>09 Tháng 2 năm 2027</strong>. Đây là ngày dự sinh bất biến!';
      }

    } else if (scenarioKey === 'case3') {
      switchMode('ivf');
      var transDate = new Date(2026, 6, 15);
      var exDate = new Date(2026, 8, 1);
      state.ivfDate = transDate;
      state.ivfType = 'day5';
      state.examDate = exDate;
      if (dom.inputIvfDate) dom.inputIvfDate.value = Clinical.toInputDate(transDate);
      if (dom.selectIvfType) dom.selectIvfType.value = 'day5';
      if (dom.inputExamDate) dom.inputExamDate.value = Clinical.toInputDate(exDate);

      var ivfLmp = Clinical.addDays(transDate, -19);
      if (wheelInstance) wheelInstance.syncWithDate(ivfLmp);

      if (dom.scenarioBannerTitle) {
        dom.scenarioBannerTitle.textContent = 'Đang xem Tình huống 3: Thai IVF chuyển Phôi ngày 5 (15/07/2026)';
      }
      if (dom.scenarioBannerText) {
        dom.scenarioBannerText.innerHTML =
          '1. Phôi ngày 5: Tuổi thai quy ước lúc chuyển là <strong>14 + 5 = 19 ngày</strong>.<br>' +
          '2. Đã trôi qua 48 ngày từ lúc chuyển -> Tuổi thai tại ngày khám: <strong>48 + 19 = 67 ngày (9 tuần 4 ngày)</strong>.<br>' +
          '3. <strong>Bẫy thi lâm sàng:</strong> Kim XANH chỉ ngày dự sinh <strong>20 Tháng 4 năm 2027</strong>. Tuyệt đối CẤM sửa ngày dự sinh này!';
      }
    }

    recalculate();
  }

  /**
   * OSCE Quiz Simulator Logic
   */
  function displayQuiz(index) {
    if (!Tools || !Tools.sampleCases) return;
    var list = Tools.sampleCases;
    state.currentQuizIndex = (index + list.length) % list.length;
    var c = list[state.currentQuizIndex];

    if (dom.quizCaseTitle) dom.quizCaseTitle.textContent = c.title;
    if (dom.quizPatientPrompt) dom.quizPatientPrompt.textContent = c.patient;
    if (dom.quizTaskPrompt) dom.quizTaskPrompt.textContent = 'Nhiệm vụ: ' + c.task;
    if (dom.quizSolutionText) dom.quizSolutionText.textContent = c.solution;
    if (dom.quizSolutionBox) dom.quizSolutionBox.classList.remove('show');
  }

  function applyQuizDataToApp() {
    var c = Tools.sampleCases[state.currentQuizIndex];
    if (!c) return;

    if (c.lmp) {
      switchMode('lmp');
      var lmp = Clinical.toDate(c.lmp);
      var ex = Clinical.toDate(c.exam);
      state.lmpDate = lmp;
      state.examDate = ex;
      if (dom.inputLmpDate) dom.inputLmpDate.value = c.lmp;
      if (dom.inputExamDate) dom.inputExamDate.value = c.exam;
      if (wheelInstance) wheelInstance.syncWithDate(lmp);
    } else if (c.ivfDate) {
      switchMode('ivf');
      var ivfD = Clinical.toDate(c.ivfDate);
      var ex2 = Clinical.toDate(c.exam);
      state.ivfDate = ivfD;
      state.examDate = ex2;
      state.ivfType = c.ivfType;
      if (dom.inputIvfDate) dom.inputIvfDate.value = c.ivfDate;
      if (dom.selectIvfType) dom.selectIvfType.value = c.ivfType;
      if (dom.inputExamDate) dom.inputExamDate.value = c.exam;
      if (theo && wheelInstance) wheelInstance.syncWithDate(theo);
    }
    recalculate();
    showToast('Đã nạp dữ liệu đề thi vào vòng xoay & form tính toán!');
    if (window.innerWidth <= 768) {
      setMobileTab('wheel');
    }
  }

  /**
   * Helper chuyển tab trên màn hình di động
   */
  function setMobileTab(tabKey) {
    if (!dom.appWorkspace) return;
    dom.appWorkspace.setAttribute('data-active-tab', tabKey);
    if (dom.mobileNavBtns) {
      dom.mobileNavBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Recalculate Everything
   */
  function recalculate() {
    var officialGA = null;
    var officialEDD = null;
    var legalBasis = '';
    var calculationSummary = '';

    // 1. Audit LMP
    var lmpAudit = Clinical.validateLMP(state.lmpCriteria);
    if (dom.lmpWarningCallout) {
      dom.lmpWarningCallout.classList.toggle('show', !lmpAudit.isReliable && state.mode === 'lmp');
    }

    // 2. Mode computation
    if (state.mode === 'lmp') {
      var naegele = Clinical.calculateNaegele(state.lmpDate);
      var ga = Clinical.calculateGAFromDates(state.lmpDate, state.examDate);

      officialEDD = naegele ? naegele.eddDate : null;
      officialGA = ga;

      legalBasis = lmpAudit.isReliable ? 'LMP tin cậy (Chuẩn Naegele)' : 'LMP không tin cậy (Khuyến nghị chuyển sang CRL)';
      calculationSummary = 'LMP: ' + Clinical.formatDate(state.lmpDate) +
        ' -> Naegele: ' + (naegele ? naegele.formattedEDD : '') + ' (' + (naegele ? naegele.formulaUsed : '') + ')';

    } else if (state.mode === 'crl') {
      var crlCalc = Clinical.calculateCRL(state.crlMm, state.crlDate, state.examDate);
      if (crlCalc) {
        officialEDD = crlCalc.eddDate;
        officialGA = {
          totalDays: crlCalc.currentGADays,
          weeks: crlCalc.currentWeeks,
          days: crlCalc.currentDays,
          formatted: crlCalc.currentFormatted,
          shortFormatted: crlCalc.currentWeeks + '+' + crlCalc.currentDays + 'w'
        };
        legalBasis = 'Chuẩn siêu âm CRL quý 1 (Thầy Luân 42 + CRL)';
        calculationSummary = 'CRL ' + state.crlMm + ' mm -> Tuổi thai tại SA: 42 + ' + state.crlMm + ' = ' + crlCalc.gaDaysAtUS + ' ngày';
      }

    } else if (state.mode === 'ivf') {
      var ivfCalc = Clinical.calculateIVF(state.ivfDate, state.ivfType, state.examDate);
      if (ivfCalc) {
        officialEDD = ivfCalc.eddDate;
        officialGA = {
          totalDays: ivfCalc.currentGADays,
          weeks: ivfCalc.currentWeeks,
          days: ivfCalc.currentDays,
          formatted: ivfCalc.currentFormatted,
          shortFormatted: ivfCalc.currentWeeks + '+' + ivfCalc.currentDays + 'w'
        };
        legalBasis = 'Chuẩn tuyệt đối IVF (' + ivfCalc.embryoName + ')';
        calculationSummary = 'Chuyển phôi ngày ' + Clinical.formatDate(state.ivfDate) + ' (+ ' + ivfCalc.embryoDays + ' ngày quy ước)';
      }

    } else if (state.mode === 'reverse') {
      var revCalc = Clinical.calculateReverseEDD(state.eddDate, state.examDate);
      if (revCalc) {
        officialEDD = revCalc.eddDate;
        officialGA = {
          totalDays: revCalc.currentGADays,
          weeks: revCalc.currentWeeks,
          days: revCalc.currentDays,
          formatted: revCalc.currentFormatted,
          shortFormatted: revCalc.currentWeeks + '+' + revCalc.currentDays + 'w'
        };
        legalBasis = 'Tính ngược từ ngày dự sinh đã biết';
        calculationSummary = 'Dự sinh: ' + Clinical.formatDate(state.eddDate) + ' -> LMP quy ước: ' + revCalc.formattedLMP;
      }
    }

    var physical = officialGA ? Clinical.calculatePhysicalCorrelates(officialGA.weeks, state.bctcCm, state.isHeadEngaged) : null;
    var milestoneData = officialGA ? Clinical.getMilestones(officialGA.totalDays) : null;

    renderHeroMetrics(officialGA, officialEDD, legalBasis, physical, milestoneData);
    renderOSCECoach(officialGA, officialEDD, lmpAudit, calculationSummary, physical, milestoneData);
    updateBabySizeAndCountdown(officialGA, officialEDD);

    if (wheelInstance && officialGA && officialEDD) {
      wheelInstance.updateReadout(officialGA.shortFormatted, Clinical.formatDate(officialEDD).slice(0, 5));
    }
  }

  function updateBabySizeAndCountdown(ga, edd) {
    if (!ga || !Tools) return;
    var fruit = Tools.getBabySize(ga.weeks);
    if (dom.babyFruitEmoji) dom.babyFruitEmoji.textContent = fruit.emoji;
    if (dom.babySizeWeekLabel) dom.babySizeWeekLabel.textContent = 'Kích thước bé tuần ' + ga.weeks + ':';
    if (dom.babyFruitName) dom.babyFruitName.textContent = fruit.name;

    if (edd && dom.babyCountdownBadge) {
      var daysLeft = Clinical.diffInDays(state.examDate, edd);
      if (daysLeft > 0) {
        dom.babyCountdownBadge.textContent = 'Còn ' + daysLeft + ' ngày đến ngày dự sinh';
      } else if (daysLeft === 0) {
        dom.babyCountdownBadge.textContent = 'Hôm nay là Ngày dự sinh (40 tuần)!';
      } else {
        dom.babyCountdownBadge.textContent = 'Đã qua ngày dự sinh ' + Math.abs(daysLeft) + ' ngày (Thai già tháng)';
      }
    }
  }

  function renderHeroMetrics(ga, edd, legalBasis, physical, milestoneData) {
    if (dom.readoutGA) dom.readoutGA.textContent = ga ? ga.formatted : '-- tuần -- ngày';
    if (dom.readoutGASub) dom.readoutGASub.textContent = ga ? 'Đã trải qua ' + ga.totalDays + ' ngày thai kỳ' : 'Vui lòng kiểm tra dữ liệu';
    if (dom.readoutEDD) dom.readoutEDD.textContent = edd ? Clinical.formatDate(edd) : '--/--/----';
    if (dom.readoutStage) dom.readoutStage.textContent = milestoneData ? milestoneData.trimester : '--';
    if (dom.readoutBCTC) {
      var bctcText = physical ? physical.bctcNote : '--';
      if (physical && physical.estimatedWeight) {
        bctcText += ' | Cân nặng ước tính: ~' + physical.estimatedWeight + ' g';
      }
      dom.readoutBCTC.textContent = bctcText;
    }
    if (dom.badgeLegalBasis) dom.badgeLegalBasis.textContent = legalBasis || 'Đang cập nhật';
  }

  function renderOSCECoach(ga, edd, lmpAudit, calculationSummary, physical, milestoneData) {
    if (dom.coachLmpStatus) {
      if (state.mode === 'lmp') {
        if (lmpAudit.isReliable) {
          dom.coachLmpStatus.innerHTML = '<strong style="color: #059669;">HỢP LỆ:</strong> Thỏa mãn toàn diện 4 tiêu chuẩn kinh nguyệt. Mốc zero của Naegele được bảo chứng an toàn.';
        } else {
          dom.coachLmpStatus.innerHTML = '<strong style="color: #D97706;">BÁO ĐỘNG LÂM SÀNG:</strong> ' +
            lmpAudit.failedReasons.join(' ') + '<br><em>Xử trí lâm sàng:</em> Bác sĩ phải gác lại LMP và yêu cầu phiếu siêu âm quý 1 để xác định tuổi thai.';
        }
      } else {
        dom.coachLmpStatus.innerHTML = 'Đang sử dụng chế độ ' + state.mode.toUpperCase() + '. LMP được quy đổi hoặc thay thế bằng thước đo chuẩn hơn.';
      }
    }

    if (dom.coachNaegeleSteps) {
      var lmp = (state.mode === 'lmp') ? state.lmpDate : (ga ? Clinical.addDays(state.examDate, -ga.totalDays) : null);
      if (lmp) {
        var day = lmp.getDate();
        var month = lmp.getMonth() + 1;
        var ruleStr = (month <= 3) ? 'Tháng 1, 2, 3 -> Ngày + 7; Tháng + 9; Năm + 0' : 'Tháng 4 đến 12 -> Ngày + 7; Tháng - 3; Năm + 1';
        dom.coachNaegeleSteps.innerHTML =
          '<strong>Kỳ kinh chót:</strong> ' + Clinical.formatDate(lmp) + '<br>' +
          '<div class="coach-step-formula">' + ruleStr + '</div><br>' +
          'Dự sinh nhẩm: (' + day + ' + 7) = ' + (day + 7) + '; ' +
          ((month <= 3) ? ('(' + month + ' + 9) = ' + (month + 9)) : ('(' + month + ' - 3) = ' + (month - 3))) +
          ' -> <strong>' + (edd ? Clinical.formatDate(edd) : '') + '</strong>';
      }
    }

    if (dom.coachCrlArbitration) {
      if (state.mode === 'crl') {
        dom.coachCrlArbitration.innerHTML =
          '<strong>Công thức Thầy Luân:</strong> <span class="coach-step-formula">Tuổi thai (ngày) = 42 + CRL (mm)</span><br>' +
          'Với CRL = ' + state.crlMm + ' mm -> Tuổi thai tại siêu âm = 42 + ' + state.crlMm + ' = ' + (42 + state.crlMm) + ' ngày.<br>' +
          '<em>Luật trọng tài:</em> Đoạn CRL 10-84 mm là cửa sổ sinh học chuẩn nhất. Dự sinh xác lập tại đây là mốc vĩnh viễn suốt thai kỳ.';
      } else if (state.mode === 'lmp' && state.lmpDate) {
        var arb = Clinical.arbitrateLMPvsCRL(state.lmpDate, 45, state.examDate, lmpAudit.isReliable);
        if (arb) {
          dom.coachCrlArbitration.innerHTML =
            'Giả định có phiếu siêu âm cùng ngày với CRL = 45 mm:<br>' +
            arb.ageWindowDescription + '<br>' +
            'Chênh lệch: ' + arb.discrepancyDays + ' ngày (Ngưỡng: ' + arb.thresholdDays + ' ngày) -> <strong>' + arb.reason + '</strong>';
        }
      } else {
        dom.coachCrlArbitration.innerHTML = 'Thước đo CRL 10-84 mm có sai số sinh học tối thiểu (+- 3 đến 5 ngày), dùng làm trọng tài khi kỳ kinh không đều.';
      }
    }

    if (dom.coachIvfTrap) {
      dom.coachIvfTrap.innerHTML =
        '<strong>Bẫy thi lâm sàng kinh điển:</strong> Trong thai IVF, ngày thụ tinh được biết chính xác tuyệt đối. ' +
        '<div class="coach-step-formula">Phôi ngày 3: +17 ngày quy ước | Phôi ngày 5: +19 ngày quy ước</div><br>' +
        '<span style="color: #E11D48; font-weight: 700;">CẤM LÙI TUỔI THAI THEO SIÊU ÂM:</span> Nếu siêu âm 12 tuần đo CRL nhỏ hơn, kết luận là <em>Thai chậm tăng trưởng sớm (Early FGR)</em>, không được sửa lùi ngày dự sinh!';
    }

    if (dom.coachMilestones && milestoneData) {
      var itemsHtml = milestoneData.milestones.map(function (m) {
        var badgeColor = m.status === 'current' ? '#059669' : (m.status === 'passed' ? '#9CA3AF' : '#D97706');
        var statusLabel = m.status === 'current' ? '[ĐANG DIỄN RA]' : (m.status === 'passed' ? '[ĐÃ QUA]' : '[SẮP TỚI]');
        return '<div style="margin-bottom: 6px; padding-left: 8px; border-left: 3px solid ' + badgeColor + ';">' +
          '<strong style="color: ' + badgeColor + ';">' + statusLabel + ' ' + m.range + ':</strong> ' + m.title + '<br>' +
          '<span style="font-size: 0.8rem; color: var(--text-secondary);">' + m.desc + '</span>' +
          '</div>';
      }).join('');
      dom.coachMilestones.innerHTML = itemsHtml;
    }
  }

  function updateRubricScore() {
    var total = 0;
    dom.rubricCheckboxes.forEach(function (cb) {
      var item = cb.closest('.rubric-item');
      var pts = parseFloat(cb.getAttribute('data-pts')) || 0;
      if (cb.checked) {
        total += pts;
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });

    total = Math.round(total * 10) / 10;
    if (dom.rubricTotalScore) {
      dom.rubricTotalScore.textContent = total.toFixed(1) + ' / 10.0';
    }

    if (dom.rubricFeedbackBadge) {
      if (total >= 8.5) {
        dom.rubricFeedbackBadge.textContent = 'XUẤT SẮC // VỮNG TAY NGHỀ';
        dom.rubricFeedbackBadge.style.color = '#059669';
        if (total === 10.0 && Tools && Tools.launchConfetti) {
          Tools.launchConfetti();
        }
      } else if (total >= 7.0) {
        dom.rubricFeedbackBadge.textContent = 'ĐẠT CHUẨN LÂM SÀNG';
        dom.rubricFeedbackBadge.style.color = '#0284C7';
      } else {
        dom.rubricFeedbackBadge.textContent = 'CẦN RÈN LUYỆN THÊM';
        dom.rubricFeedbackBadge.style.color = '#D97706';
      }
    }
  }

  function bindUIEvents() {
    // Mode tabs
    dom.modeTabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchMode(this.getAttribute('data-mode'));
      });
    });

    // Tour & Export
    if (dom.btnStartTour && Tour) {
      dom.btnStartTour.addEventListener('click', function () {
        Tour.start();
      });
    }

    if (dom.btnExportNote && Tools) {
      dom.btnExportNote.addEventListener('click', function () {
        var ga = Clinical.calculateGAFromDates(state.lmpDate, state.examDate);
        var edd = Clinical.calculateNaegele(state.lmpDate);
        var physical = ga ? Clinical.calculatePhysicalCorrelates(ga.weeks, state.bctcCm, state.isHeadEngaged) : null;
        var summaryData = {
          examDate: Clinical.formatDate(state.examDate),
          gaText: ga ? ga.formatted : '--',
          eddText: edd ? Clinical.formatDate(edd.eddDate) : '--',
          legalBasis: dom.badgeLegalBasis ? dom.badgeLegalBasis.textContent : '--',
          trimester: dom.readoutStage ? dom.readoutStage.textContent : '--',
          bctcText: physical ? physical.bctcNote : '--',
          lmpText: state.lmpDate ? Clinical.formatDate(state.lmpDate) : '--',
          nextMilestone: 'Đo độ mờ da gáy NT và làm Double Test / NIPT (11-13w6d)'
        };
        Tools.exportClinicalSummary(summaryData).then(function () {
          showToast('Đã sao chép phiếu tóm tắt khám thai vào bộ nhớ tạm!');
        }).catch(function () {
          showToast('Đã lưu nội dung phiếu khám thai!');
        });
      });
    }

    // On-Wheel Coach Events
    if (dom.scenarioTabs) {
      dom.scenarioTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var scen = this.getAttribute('data-scenario');
          updateOnWheelCoach(scen, state.onwheelStep);
          if (Tools && Tools.playTickSound) Tools.playTickSound();
        });
      });
    }

    if (dom.onwheelStepBtns) {
      dom.onwheelStepBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = parseInt(this.getAttribute('data-step'), 10);
          updateOnWheelCoach(state.onwheelScenario, step);
          if (Tools && Tools.playTickSound) Tools.playTickSound();
        });
      });
    }

    if (dom.btnToggleSightlines) {
      dom.btnToggleSightlines.addEventListener('click', function () {
        state.sightlinesEnabled = !state.sightlinesEnabled;
        if (wheelInstance) wheelInstance.setSightlinesVisible(state.sightlinesEnabled);
        this.classList.toggle('active', state.sightlinesEnabled);
        if (dom.labelSightlines) {
          dom.labelSightlines.textContent = state.sightlinesEnabled ? 'Bật' : 'Tắt';
        }
      });
    }

    if (dom.btnToggleBlind) {
      dom.btnToggleBlind.addEventListener('click', function () {
        state.blindModeEnabled = !state.blindModeEnabled;
        if (wheelInstance) wheelInstance.setBlindMode(state.blindModeEnabled);
        this.classList.toggle('blind-active', state.blindModeEnabled);
        if (dom.labelBlind) {
          dom.labelBlind.textContent = state.blindModeEnabled ? 'Đang Bật (Ẩn số)' : 'Tắt';
        }
      });
    }

    if (dom.btnAutoAlign) {
      dom.btnAutoAlign.addEventListener('click', function () {
        var data = getScenarioGuideData(state.onwheelScenario);
        if (wheelInstance && data) {
          if (data.scenarioType === 'crl') {
            var theoLmp = Clinical.addDays(data.crlDate, -data.crlGADays);
            wheelInstance.syncWithDate(theoLmp);
          } else if (data.scenarioType === 'ivf') {
            var ivfLmp = Clinical.addDays(data.ivfDate, -data.ivfAgeDays);
            wheelInstance.syncWithDate(ivfLmp);
          } else {
            wheelInstance.syncWithDate(data.targetCalendarDate);
          }
          if (Tools && Tools.playTickSound) Tools.playTickSound();
        }
      });
    }

    // Magnifier Zoom Toggle
    if (dom.btnZoomWheel && dom.wheelContainer) {
      dom.btnZoomWheel.addEventListener('click', function () {
        state.isZoomed = !state.isZoomed;
        if (state.isZoomed) {
          dom.wheelContainer.style.transform = 'scale(1.35)';
          dom.wheelContainer.style.zIndex = '50';
          this.textContent = 'Thu nhỏ (1.0x)';
          this.classList.add('btn-action-primary');
        } else {
          dom.wheelContainer.style.transform = 'scale(1)';
          dom.wheelContainer.style.zIndex = 'auto';
          this.textContent = '🔍 Kính lúp (1.4x)';
          this.classList.remove('btn-action-primary');
        }
      });
    }

    // Inputs
    if (dom.inputExamDate) {
      dom.inputExamDate.addEventListener('change', function () {
        var d = Clinical.toDate(this.value);
        if (d) {
          state.examDate = d;
          recalculate();
        }
      });
    }

    if (dom.inputLmpDate) {
      dom.inputLmpDate.addEventListener('change', function () {
        var d = Clinical.toDate(this.value);
        if (d) {
          state.lmpDate = d;
          if (wheelInstance) wheelInstance.syncWithDate(d);
          if (dom.scenarioBannerTitle) {
            dom.scenarioBannerTitle.textContent = 'Đang theo dõi đề bài tùy chỉnh của bà';
            dom.scenarioBannerText.innerHTML = 'Kỳ kinh chót ngày <strong>' + Clinical.formatDate(d) + '</strong>. Vòng xoay đã tự động đưa <strong>Kim ĐỎ</strong> về ngày này. Hãy nhìn <strong>Kim XANH</strong> để đọc ngày dự sinh!';
          }
          recalculate();
        }
      });
    }

    var checkboxes = [
      { el: dom.cbRegularCycle, prop: 'regularCycle' },
      { el: dom.cbExactRecall, prop: 'exactRecall' },
      { el: dom.cbNoHormones, prop: 'noHormones' },
      { el: dom.cbNoLactation, prop: 'noLactation' }
    ];

    checkboxes.forEach(function (item) {
      if (item.el) {
        item.el.addEventListener('change', function () {
          state.lmpCriteria[item.prop] = this.checked;
          recalculate();
        });
      }
    });

    if (dom.btnSwitchCrl) {
      dom.btnSwitchCrl.addEventListener('click', function (e) {
        e.preventDefault();
        switchMode('crl');
        if (dom.inputCrlMm) dom.inputCrlMm.focus();
      });
    }

    if (dom.inputCrlMm) {
      dom.inputCrlMm.addEventListener('input', function () {
        var val = parseFloat(this.value);
        if (!isNaN(val)) {
          state.crlMm = val;
          recalculate();
        }
      });
    }

    if (dom.inputCrlDate) {
      dom.inputCrlDate.addEventListener('change', function () {
        var d = Clinical.toDate(this.value);
        if (d) {
          state.crlDate = d;
          recalculate();
        }
      });
    }

    if (dom.inputIvfDate) {
      dom.inputIvfDate.addEventListener('change', function () {
        var d = Clinical.toDate(this.value);
        if (d) {
          state.ivfDate = d;
          recalculate();
        }
      });
    }

    if (dom.selectIvfType) {
      dom.selectIvfType.addEventListener('change', function () {
        state.ivfType = this.value;
        recalculate();
      });
    }

    if (dom.inputEddDate) {
      dom.inputEddDate.addEventListener('change', function () {
        var d = Clinical.toDate(this.value);
        if (d) {
          state.eddDate = d;
          recalculate();
        }
      });
    }

    if (dom.inputBctc) {
      dom.inputBctc.addEventListener('input', function () {
        state.bctcCm = this.value;
        recalculate();
      });
    }

    if (dom.inputHeadEngaged) {
      dom.inputHeadEngaged.addEventListener('change', function () {
        state.isHeadEngaged = this.checked;
        recalculate();
      });
    }

    // Wheel Actions
    if (dom.btnSyncWheel) {
      dom.btnSyncWheel.addEventListener('click', function () {
        if (state.lmpDate && wheelInstance) {
          wheelInstance.syncWithDate(state.lmpDate);
        }
      });
    }

    if (dom.btnTodayWheel) {
      dom.btnTodayWheel.addEventListener('click', function () {
        var today = new Date();
        state.examDate = today;
        if (dom.inputExamDate) dom.inputExamDate.value = Clinical.toInputDate(today);
        recalculate();
      });
    }

    if (dom.btnResetWheel) {
      dom.btnResetWheel.addEventListener('click', function () {
        setInitialDates();
        state.lmpCriteria = { regularCycle: true, exactRecall: true, noHormones: true, noLactation: true };
        if (dom.cbRegularCycle) dom.cbRegularCycle.checked = true;
        if (dom.cbExactRecall) dom.cbExactRecall.checked = true;
        if (dom.cbNoHormones) dom.cbNoHormones.checked = true;
        if (dom.cbNoLactation) dom.cbNoLactation.checked = true;
        switchMode('lmp');
        if (wheelInstance && state.lmpDate) wheelInstance.syncWithDate(state.lmpDate);
      });
    }

    // Scenarios
    if (dom.btnCase1) dom.btnCase1.addEventListener('click', function () { loadScenario('case1'); });
    if (dom.btnCase2) dom.btnCase2.addEventListener('click', function () { loadScenario('case2'); });
    if (dom.btnCase3) dom.btnCase3.addEventListener('click', function () { loadScenario('case3'); });

    if (dom.btnDemoSpin) {
      dom.btnDemoSpin.addEventListener('click', function () {
        if (!wheelInstance) return;
        if (dom.scenarioBannerTitle) dom.scenarioBannerTitle.textContent = 'Đang chạy mô phỏng tự xoay 360°...';
        if (dom.scenarioBannerText) dom.scenarioBannerText.textContent = 'Quan sát cách Kim ĐỎ (LMP), Kim VÀNG (Thụ tinh) và Kim XANH (Dự sinh) di chuyển đồng bộ quanh vành lịch 365 ngày!';
        wheelInstance.spinDemonstration(function () {
          if (state.lmpDate) wheelInstance.syncWithDate(state.lmpDate);
        });
      });
    }

    // OSCE Quiz Simulator Events
    if (dom.btnNextQuiz) {
      dom.btnNextQuiz.addEventListener('click', function () {
        displayQuiz(state.currentQuizIndex + 1);
      });
    }

    if (dom.btnShowSolution) {
      dom.btnShowSolution.addEventListener('click', function () {
        if (dom.quizSolutionBox) {
          dom.quizSolutionBox.classList.toggle('show');
          if (dom.quizSolutionBox.classList.contains('show') && Tools) {
            Tools.launchConfetti();
          }
        }
      });
    }

    if (dom.btnApplyQuizData) {
      dom.btnApplyQuizData.addEventListener('click', applyQuizDataToApp);
    }

    if (dom.btnStartTimer && Tools) {
      dom.btnStartTimer.addEventListener('click', function () {
        state.isTimerRunning = !state.isTimerRunning;
        if (state.isTimerRunning) {
          this.textContent = '⏸ Tạm dừng tính giờ';
          Tools.startTimer(function (secLeft) {
            var mins = String(Math.floor(secLeft / 60)).padStart(2, '0');
            var secs = String(secLeft % 60).padStart(2, '0');
            if (dom.quizTimerDisplay) dom.quizTimerDisplay.textContent = mins + ':' + secs;
          }, function () {
            if (dom.quizTimerDisplay) dom.quizTimerDisplay.textContent = '00:00 (Hết giờ!)';
            showToast('Hết 5 phút thi trạm 1 OSCE!');
          });
        } else {
          this.textContent = '▶ Tiếp tục tính giờ';
          Tools.resetTimer();
        }
      });
    }

    // Rubric
    dom.rubricCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', updateRubricScore);
    });

    // Mobile Navigation Events
    if (dom.mobileNavBtns) {
      dom.mobileNavBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = this.getAttribute('data-tab');
          if (tab) setMobileTab(tab);
        });
      });
    }

    if (dom.btnJumpToWheel) {
      dom.btnJumpToWheel.addEventListener('click', function () {
        setMobileTab('wheel');
        var wheelElem = document.getElementById('pregnancy-wheel-container');
        if (wheelElem) {
          wheelElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (dom.btnToggleCoach && dom.onwheelCard) {
      dom.btnToggleCoach.addEventListener('click', function () {
        var isCollapsed = dom.onwheelCard.classList.toggle('collapsed');
        this.setAttribute('aria-expanded', !isCollapsed);
        var label = this.querySelector('.collapse-label');
        if (label) {
          label.textContent = isCollapsed ? 'Mở rộng' : 'Thu gọn';
        }
      });
    }
  }

  function initWheel() {
    var container = document.getElementById('pregnancy-wheel-container');
    if (!container) return;

    var lastSoundDay = -1;

    wheelInstance = new Wheel(container, {
      onRotate: function (data) {
        if (dom.wheelStatusAngle) {
          dom.wheelStatusAngle.textContent = Math.round(data.rotation) + '°';
        }

        var examYear = state.examDate.getFullYear();
        var selectedDate = new Date(examYear, 0, 1);
        selectedDate.setDate(selectedDate.getDate() + data.dayOfYear);

        // Sound on day change
        if (data.dayOfYear !== lastSoundDay) {
          lastSoundDay = data.dayOfYear;
          if (Tools && Tools.playTickSound) Tools.playTickSound();
        }

        if (dom.wheelStatusLmp) {
          dom.wheelStatusLmp.textContent = Clinical.formatDate(selectedDate);
        }

        if (state.mode === 'lmp') {
          state.lmpDate = selectedDate;
          if (dom.inputLmpDate) {
            dom.inputLmpDate.value = Clinical.toInputDate(selectedDate);
          }
          recalculate();
        }
      }
    });

    if (state.lmpDate) {
      wheelInstance.syncWithDate(state.lmpDate);
    }

    if (wheelInstance) {
      wheelInstance.setSightlinesVisible(state.sightlinesEnabled);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    queryElements();
    setInitialDates();
    initWheel();
    bindUIEvents();
    updateRubricScore();
    displayQuiz(0);
    loadScenario('case1');
    updateOnWheelCoach('case1', 1);
  });
})();
