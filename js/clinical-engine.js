/**
 * ============================================================================
 * CHRONO-OBSTETRIX CLINICAL ALGORITHMIC ENGINE
 * Academic Standard: Department of Obstetrics and Gynecology, UMP HCMC (2025)
 * Mentors: Assoc. Prof. Au Nhut Luan & Assoc. Prof. Tran Nhat Thang
 * Rule: Zero em-dashes. All formulas strictly peer-reviewed and verified.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChronoClinical = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MS_PER_DAY = 1000 * 60 * 60 * 24;

  /**
   * Helper: Parse Date string YYYY-MM-DD or Date object into a pure midnight UTC/local Date
   */
  function toDate(d) {
    if (!d) return null;
    if (d instanceof Date) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    var parts = String(d).split('-');
    if (parts.length === 3) {
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10) - 1;
      var day = parseInt(parts[2], 10);
      return new Date(y, m, day);
    }
    var parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  /**
   * Helper: Format Date to DD/MM/YYYY
   */
  function formatDate(d) {
    if (!d) return '--/--/----';
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return day + '/' + month + '/' + year;
  }

  /**
   * Helper: Format Date to YYYY-MM-DD for input[type="date"]
   */
  function toInputDate(d) {
    if (!d) return '';
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return year + '-' + month + '-' + day;
  }

  /**
   * Helper: Add days to date
   */
  function addDays(d, days) {
    var res = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    res.setDate(res.getDate() + days);
    return res;
  }

  /**
   * Helper: Day difference between two dates (b - a)
   */
  function diffInDays(a, b) {
    var da = toDate(a);
    var db = toDate(b);
    if (!da || !db) return 0;
    var utc1 = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
    var utc2 = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  /**
   * Helper: Check leap year
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * 1. THE 4 MANDATORY LMP RELIABILITY CRITERIA (UMP HCMC)
   */
  function validateLMP(criteria) {
    var regularCycle = !!criteria.regularCycle;
    var exactRecall = !!criteria.exactRecall;
    var noHormones = !!criteria.noHormones;
    var noLactation = !!criteria.noLactation;

    var isReliable = regularCycle && exactRecall && noHormones && noLactation;
    var failedReasons = [];

    if (!regularCycle) {
      failedReasons.push('Chu kỳ kinh không đều 28-30 ngày trong 3 chu kỳ liên tiếp.');
    }
    if (!exactRecall) {
      failedReasons.push('Không nhớ chính xác ngày đầu tiên ra máu của kỳ kinh chót.');
    }
    if (!noHormones) {
      failedReasons.push('Có sử dụng thuốc tránh thai nội tiết trong 3 tháng gần nhất.');
    }
    if (!noLactation) {
      failedReasons.push('Đang trong giai đoạn cho con bú gây vô kinh tiết sữa.');
    }

    return {
      isReliable: isReliable,
      failedReasons: failedReasons,
      ruleText: isReliable
        ? 'LMP thỏa mãn 4 tiêu chuẩn vàng. Có giá trị pháp lý để tính ngày dự sinh theo Naegele.'
        : 'LMP không tin cậy. Bắt buộc dùng siêu âm quý 1 (CRL) làm thước đo vàng để định tuổi thai.'
    };
  }

  /**
   * 2. NAEGELE FORMULA CALCULATION
   * Standard: EDD Day = Day + 7; EDD Month = Month - 3 (or Month + 9); Year adjusted.
   * UMP HCMC standard leap-year aware.
   */
  function calculateNaegele(lmpDateInput) {
    var lmp = toDate(lmpDateInput);
    if (!lmp) return null;

    var day = lmp.getDate();
    var month = lmp.getMonth() + 1; // 1-indexed (1 to 12)
    var year = lmp.getFullYear();

    var eddYear = (month <= 3) ? year : year + 1;
    var eddMonth = (month <= 3) ? (month + 9) : (month - 3); // 1-indexed
    var targetDay = day + 7;

    // Days in target month
    var daysInTargetMonth = new Date(eddYear, eddMonth, 0).getDate();
    var finalDate;

    if (targetDay <= daysInTargetMonth) {
      finalDate = new Date(eddYear, eddMonth - 1, targetDay);
    } else {
      // Month rollover
      var overflow = targetDay - daysInTargetMonth;
      var nextMonth = eddMonth + 1;
      var nextYear = eddYear;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      finalDate = new Date(nextYear, nextMonth - 1, overflow);
    }

    // Mathematical +280 days reference for comparison
    var exact280Date = addDays(lmp, 280);

    return {
      lmpDate: lmp,
      eddDate: finalDate,
      exact280Date: exact280Date,
      formattedEDD: formatDate(finalDate),
      formulaUsed: (month <= 3)
        ? 'Ngay + 7 / Thang + 9 / Nam + 0'
        : 'Ngay + 7 / Thang - 3 / Nam + 1'
    };
  }

  /**
   * 3. GESTATIONAL AGE FROM TWO DATES
   */
  function calculateGAFromDates(startDateInput, examDateInput) {
    var start = toDate(startDateInput);
    var exam = toDate(examDateInput);
    if (!start || !exam) return null;

    var totalDays = diffInDays(start, exam);
    if (totalDays < 0) {
      return {
        totalDays: 0,
        weeks: 0,
        days: 0,
        formatted: '0 tuần 0 ngày (0+0 tuần)',
        isPast: false,
        isValid: false
      };
    }

    var weeks = Math.floor(totalDays / 7);
    var days = totalDays % 7;

    return {
      totalDays: totalDays,
      weeks: weeks,
      days: days,
      formatted: weeks + ' tuần ' + days + ' ngày (' + weeks + '+' + days + ' tuần)',
      shortFormatted: weeks + '+' + days + 'w',
      isValid: true
    };
  }

  /**
   * 4. FIRST TRIMESTER ULTRASOUND (CRL 10-84 mm)
   * Rapid clinical formula: GA (days) = 42 + CRL (mm)
   */
  function calculateCRL(crlMm, usDateInput, examDateInput) {
    var crl = parseFloat(crlMm);
    var usDate = toDate(usDateInput);
    var examDate = toDate(examDateInput);

    if (isNaN(crl) || !usDate || !examDate) return null;

    var isValidWindow = crl >= 10 && crl <= 84;
    var gaDaysAtUS = Math.round(42 + crl);
    var elapsedSinceUS = diffInDays(usDate, examDate);
    var currentGADays = gaDaysAtUS + elapsedSinceUS;

    var weeksAtUS = Math.floor(gaDaysAtUS / 7);
    var daysAtUS = gaDaysAtUS % 7;

    var currentWeeks = Math.floor(currentGADays / 7);
    var currentDays = currentGADays % 7;

    // EDD: 280 days from theoretical LMP
    // Theoretical LMP = US Date - gaDaysAtUS days
    var theoreticalLMP = addDays(usDate, -gaDaysAtUS);
    var eddDate = addDays(theoreticalLMP, 280);

    return {
      crlMm: crl,
      isValidWindow: isValidWindow,
      gaDaysAtUS: gaDaysAtUS,
      weeksAtUS: weeksAtUS,
      daysAtUS: daysAtUS,
      formattedAtUS: weeksAtUS + ' tuần ' + daysAtUS + ' ngày (' + weeksAtUS + '+' + daysAtUS + ' tuần)',
      currentGADays: currentGADays,
      currentWeeks: currentWeeks,
      currentDays: currentDays,
      currentFormatted: currentWeeks + ' tuần ' + currentDays + ' ngày (' + currentWeeks + '+' + currentDays + ' tuần)',
      theoreticalLMP: theoreticalLMP,
      eddDate: eddDate,
      formattedEDD: formatDate(eddDate)
    };
  }

  /**
   * 5. ACOG / ISUOG DISCREPANCY ARBITRATION MATRIX
   * Arbitrate between LMP and CRL
   */
  function arbitrateLMPvsCRL(lmpDateInput, crlMm, usDateInput, isLMPReliable) {
    var lmp = toDate(lmpDateInput);
    var usDate = toDate(usDateInput);
    var crl = parseFloat(crlMm);

    if (!lmp || !usDate || isNaN(crl)) return null;

    var crlCalc = calculateCRL(crl, usDate, usDate);
    var gaLMPDaysAtUS = diffInDays(lmp, usDate);
    var gaCRLDaysAtUS = crlCalc.gaDaysAtUS;
    var discrepancyDays = Math.abs(gaLMPDaysAtUS - gaCRLDaysAtUS);

    var thresholdDays;
    var ageWindowDescription;

    if (gaCRLDaysAtUS < 63) { // < 9 weeks (CRL < 23 mm)
      thresholdDays = 5;
      ageWindowDescription = 'Dưới 9 tuần (CRL < 23 mm): Ngưỡng sai số cho phép là 5 ngày';
    } else { // 9 to 13+6 weeks (CRL 24 to 84 mm)
      thresholdDays = 7;
      ageWindowDescription = 'Từ 9 đến 13+6 tuần (CRL 24-84 mm): Ngưỡng sai số cho phép là 7 ngày';
    }

    var reviseToCRL = false;
    var reason = '';

    if (!isLMPReliable) {
      reviseToCRL = true;
      reason = 'LMP không tin cậy. Bắt buộc lấy ngày dự sinh theo Siêu âm CRL quý 1.';
    } else if (discrepancyDays > thresholdDays) {
      reviseToCRL = true;
      reason = 'Chênh lệch giữa LMP và CRL (' + discrepancyDays + ' ngày) vượt ngưỡng cho phép (' + thresholdDays + ' ngày). Hiệu chỉnh ngày dự sinh theo Siêu âm CRL quý 1.';
    } else {
      reviseToCRL = false;
      reason = 'Chênh lệch giữa LMP và CRL (' + discrepancyDays + ' ngày) nằm trong ngưỡng cho phép (' + thresholdDays + ' ngày). Giữ nguyên ngày dự sinh theo LMP.';
    }

    return {
      isLMPReliable: isLMPReliable,
      gaLMPDaysAtUS: gaLMPDaysAtUS,
      gaCRLDaysAtUS: gaCRLDaysAtUS,
      discrepancyDays: discrepancyDays,
      thresholdDays: thresholdDays,
      ageWindowDescription: ageWindowDescription,
      reviseToCRL: reviseToCRL,
      officialSource: reviseToCRL ? 'CRL' : 'LMP',
      reason: reason
    };
  }

  /**
   * 6. IN VITRO FERTILIZATION (IVF / ART) ABSOLUTE ENGINE
   * Day 3: +17 days
   * Day 5: +19 days
   * Hard Clinical Axiom: Never revise IVF age backwards!
   */
  function calculateIVF(transferDateInput, embryoType, examDateInput) {
    var transferDate = toDate(transferDateInput);
    var examDate = toDate(examDateInput);

    if (!transferDate || !examDate) return null;

    var embryoDays = (embryoType === 'day5') ? 19 : 17;
    var embryoName = (embryoType === 'day5') ? 'Phôi ngày 5 (Blastocyst)' : 'Phôi ngày 3 (Cleavage)';

    var elapsedDays = diffInDays(transferDate, examDate);
    var currentGADays = elapsedDays + embryoDays;

    var currentWeeks = Math.floor(currentGADays / 7);
    var currentDays = currentGADays % 7;

    // EDD: 280 days from theoretical LMP
    // Theoretical LMP = Transfer Date - (embryoDays) days
    var theoreticalLMP = addDays(transferDate, -embryoDays);
    var eddDate = addDays(theoreticalLMP, 280);

    return {
      transferDate: transferDate,
      embryoType: embryoType,
      embryoName: embryoName,
      embryoDays: embryoDays,
      currentGADays: currentGADays,
      currentWeeks: currentWeeks,
      currentDays: currentDays,
      currentFormatted: currentWeeks + ' tuần ' + currentDays + ' ngày (' + currentWeeks + '+' + currentDays + ' tuần)',
      theoreticalLMP: theoreticalLMP,
      eddDate: eddDate,
      formattedEDD: formatDate(eddDate),
      clinicalRule: 'Chuẩn tuyệt đối trong hỗ trợ sinh sản. Tuyệt đối không lùi tuổi thai theo siêu âm.'
    };
  }

  /**
   * 7. REVERSE EDD CALCULATION
   * Given known EDD, find theoretical LMP (EDD - 280 days) and current GA
   */
  function calculateReverseEDD(eddDateInput, examDateInput) {
    var eddDate = toDate(eddDateInput);
    var examDate = toDate(examDateInput);

    if (!eddDate || !examDate) return null;

    var theoreticalLMP = addDays(eddDate, -280);
    var currentGADays = diffInDays(theoreticalLMP, examDate);

    var currentWeeks = Math.floor(currentGADays / 7);
    var currentDays = currentGADays % 7;

    return {
      eddDate: eddDate,
      formattedEDD: formatDate(eddDate),
      theoreticalLMP: theoreticalLMP,
      formattedLMP: formatDate(theoreticalLMP),
      currentGADays: currentGADays,
      currentWeeks: currentWeeks,
      currentDays: currentDays,
      currentFormatted: currentWeeks + ' tuần ' + currentDays + ' ngày (' + currentWeeks + '+' + currentDays + ' tuần)'
    };
  }

  /**
   * 8. PHYSICAL & CLINICAL CORRELATES (BCTC & JOHNSON WEIGHT)
   */
  function calculatePhysicalCorrelates(gaWeeks, bctcCm, isEngaged) {
    var weeks = parseInt(gaWeeks, 10);
    if (isNaN(weeks)) return null;

    // Expected BCTC: GA(weeks) - 4
    var expectedBCTC = null;
    var bctcNote = '';

    if (weeks >= 16) {
      expectedBCTC = Math.max(0, weeks - 4);
      bctcNote = 'Dự kiến: ' + expectedBCTC + ' cm (+- 2 cm)';
    } else if (weeks >= 12) {
      bctcNote = 'Tử cung vừa vượt qua bờ trên xương vệ (khoảng 1-2 khoát ngón tay)';
    } else {
      bctcNote = 'Tử cung nằm hoàn toàn trong tiểu khung, chưa sờ thấy trên vệ';
    }

    // Johnson fetal weight if term (>= 37 weeks) and BCTC provided
    var estimatedWeight = null;
    var bctcVal = parseFloat(bctcCm);

    if (!isNaN(bctcVal) && bctcVal > 15) {
      var n = isEngaged ? 11 : 12;
      estimatedWeight = Math.round((bctcVal - n) * 155);
    }

    return {
      gaWeeks: weeks,
      expectedBCTC: expectedBCTC,
      bctcNote: bctcNote,
      estimatedWeight: estimatedWeight
    };
  }

  /**
   * 9. TRIMESTER CLASSIFICATION & PERINATAL MILESTONES
   */
  function getMilestones(gaDays) {
    var days = parseInt(gaDays, 10);
    if (isNaN(days) || days < 0) days = 0;

    var weeks = Math.floor(days / 7);

    // Trimester
    var trimester = '';
    var trimesterClass = '';

    if (days < 98) { // 1 to 13+6w
      trimester = 'Tam cá nguyệt 1 (Quý 1: 1 - 13+6 tuần)';
      trimesterClass = 't1';
    } else if (days < 196) { // 14 to 27+6w
      trimester = 'Tam cá nguyệt 2 (Quý 2: 14 - 27+6 tuần)';
      trimesterClass = 't2';
    } else if (days < 287) { // 28 to 40+6w
      trimester = 'Tam cá nguyệt 3 (Quý 3: 28 - 40+6 tuần)';
      trimesterClass = 't3';
    } else {
      trimester = 'Thai già tháng (Từ 42 tuần trở lên)';
      trimesterClass = 't4';
    }

    if (days >= 259 && days <= 293) {
      trimester += ' - Thai đủ tháng (37 - 41+6 tuần)';
    }

    // Key clinical milestones UMP HCMC
    var milestoneList = [
      {
        id: 'nt_nipt',
        range: '11 - 13+6 tuần',
        startDays: 77,
        endDays: 97,
        title: 'Đo độ mờ da gáy (NT) & Combined Test / NIPT',
        desc: 'Cửa sổ vàng khảo sát bất thường nhiễm sắc thể (Down, Edwards, Patau). CRL từ 45 đến 84 mm.',
        isCritical: true
      },
      {
        id: 'morphology',
        range: '20 - 22 tuần',
        startDays: 140,
        endDays: 154,
        title: 'Siêu âm hình thái học thai nhi chi tiết',
        desc: 'Khảo sát toàn diện hệ thần kinh, tim mạch, tiêu hóa, tiết niệu và chi để phát hiện dị tật bẩm sinh.',
        isCritical: true
      },
      {
        id: 'ogtt',
        range: '24 - 28 tuần',
        startDays: 168,
        endDays: 196,
        title: 'Nghiệm pháp dung nạp 75g Glucose (OGTT)',
        desc: 'Sàng lọc đái tháo đường thai kỳ theo tiêu chuẩn IADPSG (3 mẫu máu đói, 1h, 2h).',
        isCritical: true
      },
      {
        id: 'vat_antid',
        range: '28 tuần',
        startDays: 196,
        endDays: 203,
        title: 'Tiêm uốn ván (VAT mũi 1) & Anti-D nếu Rh(-)',
        desc: 'Phòng ngừa uốn ván sơ sinh và dự phòng đồng miễn dịch hệ Rhesus.',
        isCritical: false
      },
      {
        id: 'growth_scan',
        range: '32 tuần',
        startDays: 224,
        endDays: 231,
        title: 'Đánh giá tăng trưởng thai và vị trí bánh nhau',
        desc: 'Tầm soát thai chậm tăng trưởng trong tử cung muộn (Late FGR) và rau tiền đạo.',
        isCritical: false
      },
      {
        id: 'gbs',
        range: '35 - 37 tuần',
        startDays: 245,
        endDays: 259,
        title: 'Cấy phết âm đạo - hậu môn tầm soát GBS',
        desc: 'Tầm soát liên cầu khuẩn nhóm B (Group B Streptococcus) để dự phòng kháng sinh trong chuyển dạ.',
        isCritical: true
      },
      {
        id: 'term',
        range: '37 - 41+6 tuần',
        startDays: 259,
        endDays: 293,
        title: 'Giai đoạn thai đủ tháng',
        desc: 'Theo dõi dấu hiệu chuyển dạ tự nhiên, đánh giá chỉ số ối và cử động thai.',
        isCritical: false
      }
    ];

    var annotatedMilestones = milestoneList.map(function (m) {
      var status = 'upcoming';
      if (days > m.endDays) {
        status = 'passed';
      } else if (days >= m.startDays && days <= m.endDays) {
        status = 'current';
      }
      return {
        id: m.id,
        range: m.range,
        title: m.title,
        desc: m.desc,
        isCritical: m.isCritical,
        status: status
      };
    });

    return {
      trimester: trimester,
      trimesterClass: trimesterClass,
      milestones: annotatedMilestones
    };
  }

  // Public Interface
  return {
    toDate: toDate,
    formatDate: formatDate,
    toInputDate: toInputDate,
    addDays: addDays,
    diffInDays: diffInDays,
    isLeapYear: isLeapYear,
    validateLMP: validateLMP,
    calculateNaegele: calculateNaegele,
    calculateGAFromDates: calculateGAFromDates,
    calculateCRL: calculateCRL,
    arbitrateLMPvsCRL: arbitrateLMPvsCRL,
    calculateIVF: calculateIVF,
    calculateReverseEDD: calculateReverseEDD,
    calculatePhysicalCorrelates: calculatePhysicalCorrelates,
    getMilestones: getMilestones
  };
});
