/**
 * ============================================================================
 * CHRONO-OBSTETRIX DUAL-RING VECTOR WHEEL ENGINE (PASTEL PEACH CLAY)
 * High Legibility: Crisp typography, prominent day/week markers, high-contrast labels
 * Theme: Sweet Pastel Peach, Cream & 3D Tactile Clay Aesthetics
 * Physics: Rotational dragging via atan2, snap-to-day, spring easing
 * Rule: Zero em-dashes.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChronoWheel = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  
  // Coordinate Space: 540 x 540 (Center 270, 270)
  var CX = 270;
  var CY = 270;
  var R_CALENDAR_OUTER = 260;
  var R_CALENDAR_INNER = 198;
  var R_INNER_DISC = 194;
  var R_MILESTONE_TRACK = 158;
  var R_WEEKS_TRACK = 136;
  var R_TRIMESTER_TRACK = 88;
  var R_CENTER_HUB = 68;

  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var MONTH_NAMES = [
    'THÁNG 1', 'THÁNG 2', 'THÁNG 3', 'THÁNG 4', 'THÁNG 5', 'THÁNG 6',
    'THÁNG 7', 'THÁNG 8', 'THÁNG 9', 'THÁNG 10', 'THÁNG 11', 'THÁNG 12'
  ];

  function polarToCartesian(cx, cy, r, angleInDegrees) {
    var rad = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (r * Math.cos(rad)),
      y: cy + (r * Math.sin(rad))
    };
  }

  function describeArc(cx, cy, innerR, outerR, startAngle, endAngle) {
    var startOuter = polarToCartesian(cx, cy, outerR, endAngle);
    var endOuter = polarToCartesian(cx, cy, outerR, startAngle);
    var startInner = polarToCartesian(cx, cy, innerR, startAngle);
    var endInner = polarToCartesian(cx, cy, innerR, endAngle);

    var sweep = endAngle - startAngle;
    var largeArcFlag = sweep > 180 ? 1 : 0;

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', startInner.x, startInner.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, endInner.x, endInner.y,
      'Z'
    ].join(' ');
  }

  function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay) - 1;
    return Math.max(0, Math.min(364, day));
  }

  function PregnancyWheel(containerId, options) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) {
      throw new Error('ChronoWheel: Container element not found: ' + containerId);
    }

    this.options = options || {};
    this.currentRotation = 0;
    this.isDragging = false;
    this.startAngle = 0;
    this.startRotation = 0;
    this.onRotateCallback = typeof this.options.onRotate === 'function' ? this.options.onRotate : null;
    this.enableSightlines = false;
    this.isBlindMode = false;
    this.activeGuide = null;
    this.cachedGAText = '0w 0d';
    this.cachedEDDText = '';
    this.currentExamAngle = 0;

    this.init();
  }

  PregnancyWheel.prototype.init = function () {
    this.container.innerHTML = '';
    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('viewBox', '0 0 540 540');
    this.svg.setAttribute('class', 'pregnancy-wheel-svg');
    this.svg.setAttribute('aria-label', 'Interactive Pregnancy Wheel');

    this.createDefs();

    // 1. Fixed Outer Calendar Ring
    this.renderOuterCalendarRing();

    // 2. Rotatable Inner Gestational Disc
    this.rotatableGroup = document.createElementNS(SVG_NS, 'g');
    this.rotatableGroup.setAttribute('id', 'wheel-rotatable-disc');
    this.rotatableGroup.style.transformOrigin = CX + 'px ' + CY + 'px';
    this.svg.appendChild(this.rotatableGroup);

    this.renderInnerGestationalDisc();

    // 3. Center Hub (Readout)
    this.renderCenterHub();

    // 4. Fixed Top Exam Date Pointer
    this.renderExamPointer();

    // 5. Laser Sightlines Group
    this.laserGroup = document.createElementNS(SVG_NS, 'g');
    this.laserGroup.setAttribute('id', 'wheel-laser-sightlines');
    this.svg.appendChild(this.laserGroup);

    // 6. Direct On-Wheel Educational Guide Overlay Group
    this.guideGroup = document.createElementNS(SVG_NS, 'g');
    this.guideGroup.setAttribute('id', 'wheel-guide-overlay');
    this.svg.appendChild(this.guideGroup);

    this.container.appendChild(this.svg);
    this.bindEvents();
  };

  /**
   * SVG Filters & Gradients (Pastel Peach Clay Theme)
   */
  PregnancyWheel.prototype.createDefs = function () {
    var defs = document.createElementNS(SVG_NS, 'defs');

    // Soft Shadow Filter for Clay Look
    var filterShadow = document.createElementNS(SVG_NS, 'filter');
    filterShadow.setAttribute('id', 'clay-shadow');
    filterShadow.setAttribute('x', '-15%');
    filterShadow.setAttribute('y', '-15%');
    filterShadow.setAttribute('width', '130%');
    filterShadow.setAttribute('height', '130%');

    var feDrop = document.createElementNS(SVG_NS, 'feDropShadow');
    feDrop.setAttribute('dx', '0');
    feDrop.setAttribute('dy', '3');
    feDrop.setAttribute('stdDeviation', '3');
    feDrop.setAttribute('flood-color', 'rgba(244, 63, 94, 0.25)');
    filterShadow.appendChild(feDrop);
    defs.appendChild(filterShadow);

    // Radial Gradient for Center Hub (Marshmallow 3D Dome)
    var hubGrad = document.createElementNS(SVG_NS, 'radialGradient');
    hubGrad.setAttribute('id', 'hub-radial');
    hubGrad.setAttribute('cx', '45%');
    hubGrad.setAttribute('cy', '40%');
    hubGrad.setAttribute('r', '60%');

    var stop1 = document.createElementNS(SVG_NS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#FFFFFF');
    var stop2 = document.createElementNS(SVG_NS, 'stop');
    stop2.setAttribute('offset', '70%');
    stop2.setAttribute('stop-color', '#FFF5F0');
    var stop3 = document.createElementNS(SVG_NS, 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#FFE4DA');
    hubGrad.appendChild(stop1);
    hubGrad.appendChild(stop2);
    hubGrad.appendChild(stop3);
    defs.appendChild(hubGrad);

    this.svg.appendChild(defs);
  };

  /**
   * 1. FIXED OUTER CALENDAR RING (Pastel Ivory Track with Crisp Dark Text)
   */
  PregnancyWheel.prototype.renderOuterCalendarRing = function () {
    var outerGroup = document.createElementNS(SVG_NS, 'g');
    outerGroup.setAttribute('id', 'wheel-calendar-ring');

    // Outer Background Track (Creamy Peach Clay)
    var bgRing = document.createElementNS(SVG_NS, 'path');
    var bgPath = describeArc(CX, CY, R_CALENDAR_INNER, R_CALENDAR_OUTER, 0, 359.99);
    bgRing.setAttribute('d', bgPath);
    bgRing.setAttribute('fill', '#FFFDFB');
    bgRing.setAttribute('stroke', '#FFE0D6');
    bgRing.setAttribute('stroke-width', '2');
    outerGroup.appendChild(bgRing);

    var totalDays = 365;
    var dayAccum = 0;

    for (var m = 0; m < 12; m++) {
      var daysInMonth = MONTH_DAYS[m];
      var startDeg = (dayAccum / totalDays) * 360;
      var endDeg = ((dayAccum + daysInMonth) / totalDays) * 360;
      var midDeg = (startDeg + endDeg) / 2;

      // Month separator line (Warm peach-pink)
      var sepP1 = polarToCartesian(CX, CY, R_CALENDAR_INNER, startDeg);
      var sepP2 = polarToCartesian(CX, CY, R_CALENDAR_OUTER, startDeg);
      var sepLine = document.createElementNS(SVG_NS, 'line');
      sepLine.setAttribute('x1', sepP1.x);
      sepLine.setAttribute('y1', sepP1.y);
      sepLine.setAttribute('x2', sepP2.x);
      sepLine.setAttribute('y2', sepP2.y);
      sepLine.setAttribute('stroke', '#FDA4AF');
      sepLine.setAttribute('stroke-width', '1.8');
      outerGroup.appendChild(sepLine);

      // Month Label Text (Dark Velvet Plum, Super Legible)
      var labelR = (R_CALENDAR_INNER + R_CALENDAR_OUTER) / 2 + 6;
      var labelPos = polarToCartesian(CX, CY, labelR, midDeg);
      var text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', labelPos.x);
      text.setAttribute('y', labelPos.y + 4);
      text.setAttribute('class', 'svg-month-label');
      
      var textRot = midDeg;
      if (textRot > 90 && textRot < 270) {
        textRot += 180;
      }
      text.setAttribute('transform', 'rotate(' + textRot + ' ' + labelPos.x + ' ' + labelPos.y + ')');
      text.textContent = MONTH_NAMES[m];
      outerGroup.appendChild(text);

      // Day ticks & explicit day numbers (1, 10, 20, 30)
      for (var d = 0; d < daysInMonth; d++) {
        var dayNum = d + 1;
        var dayDeg = ((dayAccum + d) / totalDays) * 360;
        var isKeyDay = (dayNum === 1 || dayNum === 10 || dayNum === 20 || dayNum === 30);
        var isFiveDay = (dayNum % 5 === 0);

        var tickLen = isKeyDay ? 7 : (isFiveDay ? 5 : 3);
        var tp1 = polarToCartesian(CX, CY, R_CALENDAR_INNER + 1, dayDeg);
        var tp2 = polarToCartesian(CX, CY, R_CALENDAR_INNER + 1 + tickLen, dayDeg);

        var tick = document.createElementNS(SVG_NS, 'line');
        tick.setAttribute('x1', tp1.x);
        tick.setAttribute('y1', tp1.y);
        tick.setAttribute('x2', tp2.x);
        tick.setAttribute('y2', tp2.y);
        tick.setAttribute('stroke', isKeyDay ? '#F43F5E' : (isFiveDay ? '#FDA4AF' : '#FED7AA'));
        tick.setAttribute('stroke-width', isKeyDay ? '1.6' : '0.8');
        outerGroup.appendChild(tick);

        // Day number
        if (isKeyDay) {
          var numPos = polarToCartesian(CX, CY, R_CALENDAR_INNER + 15, dayDeg);
          var numText = document.createElementNS(SVG_NS, 'text');
          numText.setAttribute('x', numPos.x);
          numText.setAttribute('y', numPos.y + 3);
          numText.setAttribute('class', 'svg-day-num');
          
          var numRot = dayDeg;
          if (numRot > 90 && numRot < 270) {
            numRot += 180;
          }
          numText.setAttribute('transform', 'rotate(' + numRot + ' ' + numPos.x + ' ' + numPos.y + ')');
          numText.textContent = String(dayNum);
          outerGroup.appendChild(numText);
        }
      }

      dayAccum += daysInMonth;
    }

    this.svg.appendChild(outerGroup);
  };

  /**
   * 2. ROTATABLE INNER GESTATIONAL DISC (Soft Milk Peach Clay with Pastel Sectors)
   */
  PregnancyWheel.prototype.renderInnerGestationalDisc = function () {
    var disc = this.rotatableGroup;
    var degPerDay = 360 / 365;

    // Disc Base Surface
    var discBg = document.createElementNS(SVG_NS, 'circle');
    discBg.setAttribute('cx', CX);
    discBg.setAttribute('cy', CY);
    discBg.setAttribute('r', R_INNER_DISC);
    discBg.setAttribute('fill', '#FFF2EC');
    discBg.setAttribute('stroke', '#FFD8CC');
    discBg.setAttribute('stroke-width', '2');
    disc.appendChild(discBg);

    // Trimester Pastel Sectors
    // Quý 1: Pastel Mint (Day 0 to 97)
    var q1Deg = 97 * degPerDay;
    var q1Arc = document.createElementNS(SVG_NS, 'path');
    q1Arc.setAttribute('d', describeArc(CX, CY, R_TRIMESTER_TRACK, R_WEEKS_TRACK, 0, q1Deg));
    q1Arc.setAttribute('fill', '#ECFDF5');
    q1Arc.setAttribute('stroke', '#6EE7B7');
    q1Arc.setAttribute('stroke-width', '1.2');
    disc.appendChild(q1Arc);

    // Quý 2: Pastel Butter (Day 98 to 195)
    var q2DegStart = 98 * degPerDay;
    var q2DegEnd = 195 * degPerDay;
    var q2Arc = document.createElementNS(SVG_NS, 'path');
    q2Arc.setAttribute('d', describeArc(CX, CY, R_TRIMESTER_TRACK, R_WEEKS_TRACK, q2DegStart, q2DegEnd));
    q2Arc.setAttribute('fill', '#FEFCE8');
    q2Arc.setAttribute('stroke', '#FDE047');
    q2Arc.setAttribute('stroke-width', '1.2');
    disc.appendChild(q2Arc);

    // Quý 3: Pastel Blossom Rose (Day 196 to 280)
    var q3DegStart = 196 * degPerDay;
    var q3DegEnd = 280 * degPerDay;
    var q3Arc = document.createElementNS(SVG_NS, 'path');
    q3Arc.setAttribute('d', describeArc(CX, CY, R_TRIMESTER_TRACK, R_WEEKS_TRACK, q3DegStart, q3DegEnd));
    q3Arc.setAttribute('fill', '#FFF1F2');
    q3Arc.setAttribute('stroke', '#FDA4AF');
    q3Arc.setAttribute('stroke-width', '1.2');
    disc.appendChild(q3Arc);

    // 40 Gestational Weeks: ticks and numbers
    for (var w = 0; w <= 42; w++) {
      var wDays = w * 7;
      var wDeg = wDays * degPerDay;
      var isMajor = (w % 4 === 0) || w === 12 || w === 40;

      var p1 = polarToCartesian(CX, CY, R_WEEKS_TRACK - (isMajor ? 8 : 4), wDeg);
      var p2 = polarToCartesian(CX, CY, R_WEEKS_TRACK, wDeg);

      var tick = document.createElementNS(SVG_NS, 'line');
      tick.setAttribute('x1', p1.x);
      tick.setAttribute('y1', p1.y);
      tick.setAttribute('x2', p2.x);
      tick.setAttribute('y2', p2.y);
      tick.setAttribute('stroke', isMajor ? '#E11D48' : '#FCA5A5');
      tick.setAttribute('stroke-width', isMajor ? '1.8' : '0.9');
      disc.appendChild(tick);

      if (isMajor && w <= 40) {
        var numPos = polarToCartesian(CX, CY, R_WEEKS_TRACK - 16, wDeg);
        var numText = document.createElementNS(SVG_NS, 'text');
        numText.setAttribute('x', numPos.x);
        numText.setAttribute('y', numPos.y + 3);
        numText.setAttribute('class', 'svg-week-label');
        
        var wRot = wDeg;
        if (wRot > 90 && wRot < 270) {
          wRot += 180;
        }
        numText.setAttribute('transform', 'rotate(' + wRot + ' ' + numPos.x + ' ' + numPos.y + ')');
        numText.textContent = w + 'w';
        disc.appendChild(numText);
      }
    }

    // Milestones candy dots
    var milestones = [
      { day: 84, label: 'NT/NIPT', color: '#10B981' },
      { day: 147, label: 'Hình thái học', color: '#0284C7' },
      { day: 182, label: 'OGTT 75g', color: '#D97706' },
      { day: 196, label: 'VAT 1', color: '#7C3AED' },
      { day: 252, label: 'GBS', color: '#DB2777' },
      { day: 280, label: 'Đủ tháng', color: '#E11D48' }
    ];

    for (var i = 0; i < milestones.length; i++) {
      var ms = milestones[i];
      var msDeg = ms.day * degPerDay;
      var dotPos = polarToCartesian(CX, CY, R_MILESTONE_TRACK, msDeg);

      var dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', dotPos.x);
      dot.setAttribute('cy', dotPos.y);
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', ms.color);
      dot.setAttribute('stroke', '#FFFFFF');
      dot.setAttribute('stroke-width', '1.5');
      dot.setAttribute('filter', 'url(#clay-shadow)');
      disc.appendChild(dot);
    }

    // ------------------------------------------------------------------------
    // 3 CLAY INDICATOR NEEDLES
    // ------------------------------------------------------------------------

    // 1. Strawberry Red Needle at Day 0: Kỳ kinh chót (LMP)
    var lmpNeedle = this.createNeedle(0, R_INNER_DISC, '#E11D48', 'KỲ KINH CHÓT (LMP)', true);
    disc.appendChild(lmpNeedle);

    // 2. Honey Butter Gold Needle at Day 14: Thụ tinh quy ước (+14d)
    var fertNeedle = this.createNeedle(14 * degPerDay, R_MILESTONE_TRACK + 18, '#D97706', 'THỤ TINH (+14d)', false);
    disc.appendChild(fertNeedle);

    // 3. Mint Emerald Needle at Day 280: Dự sinh (EDD - 40w)
    var eddNeedle = this.createNeedle(280 * degPerDay, R_INNER_DISC, '#059669', 'DỰ SINH (EDD 40w)', true);
    disc.appendChild(eddNeedle);
  };

  /**
   * Helper: Needle Constructor (Chunky Clay Pins)
   */
  PregnancyWheel.prototype.createNeedle = function (deg, lengthR, color, tag, isPrimary) {
    var group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'wheel-needle');

    var p1 = polarToCartesian(CX, CY, R_CENTER_HUB + 2, deg);
    var p2 = polarToCartesian(CX, CY, lengthR, deg);

    var line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', isPrimary ? '3.8' : '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('filter', 'url(#clay-shadow)');
    group.appendChild(line);

    // Arrow pointer at tip
    var tipInner = polarToCartesian(CX, CY, lengthR - 9, deg - 2.8);
    var tipOuter = polarToCartesian(CX, CY, lengthR, deg);
    var tipOther = polarToCartesian(CX, CY, lengthR - 9, deg + 2.8);

    var arrow = document.createElementNS(SVG_NS, 'polygon');
    arrow.setAttribute('points', tipInner.x + ',' + tipInner.y + ' ' + tipOuter.x + ',' + tipOuter.y + ' ' + tipOther.x + ',' + tipOther.y);
    arrow.setAttribute('fill', color);
    arrow.setAttribute('stroke', '#FFFFFF');
    arrow.setAttribute('stroke-width', '1.2');
    group.appendChild(arrow);

    // Badge / Tag text
    var tagPos = polarToCartesian(CX, CY, lengthR - 22, deg);
    var tagText = document.createElementNS(SVG_NS, 'text');
    tagText.setAttribute('x', tagPos.x);
    tagText.setAttribute('y', tagPos.y + 3);
    tagText.setAttribute('class', 'svg-needle-text');
    tagText.setAttribute('fill', color);

    var tagRot = deg;
    if (tagRot > 90 && tagRot < 270) {
      tagRot += 180;
    }
    tagText.setAttribute('transform', 'rotate(' + tagRot + ' ' + tagPos.x + ' ' + tagPos.y + ')');
    tagText.textContent = tag;
    group.appendChild(tagText);

    return group;
  };

  /**
   * 3. FIXED CENTER HUB (Marshmallow 3D Clay Dome)
   */
  PregnancyWheel.prototype.renderCenterHub = function () {
    var hub = document.createElementNS(SVG_NS, 'g');
    hub.setAttribute('id', 'wheel-center-hub');
    hub.style.pointerEvents = 'none';

    var hubCircle = document.createElementNS(SVG_NS, 'circle');
    hubCircle.setAttribute('cx', CX);
    hubCircle.setAttribute('cy', CY);
    hubCircle.setAttribute('r', R_CENTER_HUB);
    hubCircle.setAttribute('fill', 'url(#hub-radial)');
    hubCircle.setAttribute('stroke', '#FFFFFF');
    hubCircle.setAttribute('stroke-width', '3');
    hubCircle.setAttribute('filter', 'url(#clay-shadow)');
    hub.appendChild(hubCircle);

    // Title
    var title = document.createElementNS(SVG_NS, 'text');
    title.setAttribute('x', CX);
    title.setAttribute('y', CY - 24);
    title.setAttribute('class', 'svg-center-title');
    title.textContent = 'TUỔI THAI';
    hub.appendChild(title);

    // Primary Value
    this.hubValText = document.createElementNS(SVG_NS, 'text');
    this.hubValText.setAttribute('x', CX);
    this.hubValText.setAttribute('y', CY + 4);
    this.hubValText.setAttribute('class', 'svg-center-val');
    this.hubValText.textContent = '0w 0d';
    hub.appendChild(this.hubValText);

    // Subtitle
    this.hubSubText = document.createElementNS(SVG_NS, 'text');
    this.hubSubText.setAttribute('x', CX);
    this.hubSubText.setAttribute('y', CY + 24);
    this.hubSubText.setAttribute('class', 'svg-center-sub');
    this.hubSubText.textContent = 'Xoay để chọn';
    hub.appendChild(this.hubSubText);

    this.svg.appendChild(hub);
  };

  /**
   * 4. FIXED POINTER / EXAM DATE INDICATOR (At top / 12 o'clock)
   */
  PregnancyWheel.prototype.renderExamPointer = function () {
    var pointer = document.createElementNS(SVG_NS, 'g');
    pointer.setAttribute('id', 'wheel-exam-pointer');
    pointer.style.pointerEvents = 'none';

    var tipY = R_CALENDAR_INNER - 2;
    var arrow = document.createElementNS(SVG_NS, 'polygon');
    arrow.setAttribute('points', (CX - 8) + ',' + (tipY - 14) + ' ' + (CX + 8) + ',' + (tipY - 14) + ' ' + CX + ',' + tipY);
    arrow.setAttribute('fill', '#E11D48');
    arrow.setAttribute('stroke', '#FFFFFF');
    arrow.setAttribute('stroke-width', '1.5');
    arrow.setAttribute('filter', 'url(#clay-shadow)');
    pointer.appendChild(arrow);

    this.svg.appendChild(pointer);
  };

  /**
   * ROTATIONAL PHYSICS & EVENT BINDING
   */
  PregnancyWheel.prototype.bindEvents = function () {
    var self = this;

    function getEventAngle(e) {
      var rect = self.container.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      var clientX = e.clientX;
      var clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      var dx = clientX - centerX;
      var dy = clientY - centerY;
      var rad = Math.atan2(dy, dx);
      var deg = rad * 180 / Math.PI;
      deg = (deg + 90) % 360;
      if (deg < 0) deg += 360;
      return deg;
    }

    function onPointerDown(e) {
      e.preventDefault();
      self.isDragging = true;
      self.startAngle = getEventAngle(e);
      self.startRotation = self.currentRotation;

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!self.isDragging) return;
      e.preventDefault();

      var currentAngle = getEventAngle(e);
      var delta = currentAngle - self.startAngle;
      var newRotation = (self.startRotation + delta) % 360;
      if (newRotation < 0) newRotation += 360;

      self.setRotation(newRotation, true);
    }

    function onPointerUp(e) {
      if (!self.isDragging) return;
      self.isDragging = false;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      var degPerDay = 360 / 365;
      var nearestDay = Math.round(self.currentRotation / degPerDay);
      var snappedRotation = (nearestDay * degPerDay) % 360;

      self.animateSnap(snappedRotation);
    }

    this.container.addEventListener('pointerdown', onPointerDown);
  };

  function formatDateShort(d) {
    if (!d) return '';
    var day = String(d.getDate()).padStart(2, '0');
    var m = String(d.getMonth() + 1).padStart(2, '0');
    return day + '/' + m;
  }

  function createClayBadge(x, y, text, strokeColor, bgColor, textColor) {
    var g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'svg-guide-badge');

    var textLen = text.length;
    var width = Math.max(116, textLen * 7.4 + 22);
    var height = 26;

    x = Math.max(width / 2 + 10, Math.min(540 - width / 2 - 10, x));
    y = Math.max(height / 2 + 10, Math.min(540 - height / 2 - 10, y));

    var rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x - width / 2);
    rect.setAttribute('y', y - height / 2);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', '13');
    rect.setAttribute('fill', bgColor || '#FFFDFB');
    rect.setAttribute('stroke', strokeColor || '#E11D48');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('filter', 'url(#clay-shadow)');
    g.appendChild(rect);

    var txt = document.createElementNS(SVG_NS, 'text');
    txt.setAttribute('x', x);
    txt.setAttribute('y', y + 4);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    txt.setAttribute('font-size', '10px');
    txt.setAttribute('font-weight', '800');
    txt.setAttribute('fill', textColor || '#4A1D24');
    txt.textContent = text;
    g.appendChild(txt);

    return g;
  }

  function createPulsingBeacon(x, y, color) {
    var g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'svg-guide-beacon');

    var ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', x);
    ring.setAttribute('cy', y);
    ring.setAttribute('r', '14');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', color);
    ring.setAttribute('stroke-width', '2.5');
    ring.setAttribute('class', 'svg-beacon-ring');
    g.appendChild(ring);

    var dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', color);
    dot.setAttribute('stroke', '#FFFFFF');
    dot.setAttribute('stroke-width', '1.5');
    g.appendChild(dot);

    return g;
  }

  function createLaserBeam(p1, p2, color, isDashed) {
    var line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    if (isDashed !== false) {
      line.setAttribute('stroke-dasharray', '6, 4');
      line.setAttribute('class', 'svg-laser-animated');
    }
    line.setAttribute('filter', 'url(#clay-shadow)');
    return line;
  }

  function createCurvedRotationArrow(cx, cy, r, fromDeg, toDeg, color, textLabel) {
    var g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'svg-guide-rotation-arrow');

    var diff = (toDeg - fromDeg + 360) % 360;
    if (diff > 180) diff -= 360;
    var isClockwise = diff > 0;

    var pStart = polarToCartesian(cx, cy, r, fromDeg);
    var pEnd = polarToCartesian(cx, cy, r, toDeg);
    var midDeg = fromDeg + diff / 2;
    var pMid = polarToCartesian(cx, cy, r - 12, midDeg);

    var path = document.createElementNS(SVG_NS, 'path');
    var sweepFlag = isClockwise ? 1 : 0;
    var largeArc = Math.abs(diff) > 180 ? 1 : 0;
    var d = 'M ' + pStart.x + ' ' + pStart.y + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' ' + sweepFlag + ' ' + pEnd.x + ' ' + pEnd.y;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '3.5');
    path.setAttribute('stroke-dasharray', '6, 4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('class', 'svg-laser-animated');
    g.appendChild(path);

    var tangentAngle = toDeg + (isClockwise ? 90 : -90);
    var tip1 = polarToCartesian(pEnd.x, pEnd.y, 8, tangentAngle + 140);
    var tip2 = polarToCartesian(pEnd.x, pEnd.y, 8, tangentAngle - 140);

    var arrowHead = document.createElementNS(SVG_NS, 'polygon');
    arrowHead.setAttribute('points', pEnd.x + ',' + pEnd.y + ' ' + tip1.x + ',' + tip1.y + ' ' + tip2.x + ',' + tip2.y);
    arrowHead.setAttribute('fill', color);
    arrowHead.setAttribute('stroke', '#FFFFFF');
    arrowHead.setAttribute('stroke-width', '1');
    g.appendChild(arrowHead);

    if (textLabel) {
      var badge = createClayBadge(pMid.x, pMid.y, textLabel, color, '#FFFDFB', color);
      g.appendChild(badge);
    }

    return g;
  }

  PregnancyWheel.prototype.setRotation = function (deg, triggerCallback) {
    this.currentRotation = (deg % 360 + 360) % 360;
    this.rotatableGroup.style.transform = 'rotate(' + this.currentRotation + 'deg)';

    if (this.enableSightlines) {
      this.updateRealtimeSightlines();
    }
    if (this.activeGuide) {
      this.refreshOnWheelGuide();
    }

    if (triggerCallback && typeof this.onRotateCallback === 'function') {
      var degPerDay = 360 / 365;
      var calendarDeg = this.currentRotation;
      var dayOfYear = Math.round(calendarDeg / degPerDay) % 365;

      this.onRotateCallback({
        rotation: this.currentRotation,
        dayOfYear: dayOfYear
      });
    }
  };

  PregnancyWheel.prototype.animateSnap = function (targetDeg, onComplete) {
    var self = this;
    var start = this.currentRotation;
    var diff = targetDeg - start;

    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    var startTime = performance.now();
    var duration = 280;

    function step(now) {
      var progress = Math.min(1, (now - startTime) / duration);
      var ease = 1 - Math.pow(1 - progress, 3);
      var cur = start + diff * ease;

      self.setRotation(cur, false);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        self.setRotation(targetDeg, true);
        if (typeof onComplete === 'function') onComplete();
      }
    }

    requestAnimationFrame(step);
  };

  PregnancyWheel.prototype.updateReadout = function (gaText, eddText) {
    this.cachedGAText = gaText;
    this.cachedEDDText = eddText;
    if (this.hubValText) {
      this.hubValText.textContent = this.isBlindMode ? '?w ?d' : (gaText || '0w 0d');
    }
    if (this.hubSubText) {
      this.hubSubText.textContent = this.isBlindMode ? '(Thi thật: Tự đọc mắt)' : (eddText ? 'Dự sinh: ' + eddText : 'Đang tính...');
    }
  };

  PregnancyWheel.prototype.setBlindMode = function (isBlind) {
    this.isBlindMode = !!isBlind;
    this.updateReadout(this.cachedGAText, this.cachedEDDText);
  };

  PregnancyWheel.prototype.setSightlinesVisible = function (visible) {
    this.enableSightlines = !!visible;
    this.updateRealtimeSightlines();
  };

  PregnancyWheel.prototype.updateRealtimeSightlines = function (examDate) {
    if (!this.laserGroup) return;
    this.laserGroup.innerHTML = '';
    if (!this.enableSightlines) return;

    var degPerDay = 360 / 365;

    // 1. LMP sightline (Red)
    var lmpAngle = this.currentRotation;
    var pLmp1 = polarToCartesian(CX, CY, R_CENTER_HUB + 4, lmpAngle);
    var pLmp2 = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 8, lmpAngle);
    this.laserGroup.appendChild(createLaserBeam(pLmp1, pLmp2, '#E11D48', true));

    // 2. EDD sightline (Green)
    var eddAngle = (this.currentRotation + 280 * degPerDay) % 360;
    var pEdd1 = polarToCartesian(CX, CY, R_CENTER_HUB + 4, eddAngle);
    var pEdd2 = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 8, eddAngle);
    this.laserGroup.appendChild(createLaserBeam(pEdd1, pEdd2, '#059669', true));

    // 3. Exam Date sightline (Amber/Strawberry)
    var exDate = examDate || (this.activeGuide && this.activeGuide.data ? this.activeGuide.data.examDate : new Date());
    var examAngle = (getDayOfYear(exDate) * degPerDay) % 360;
    var pEx1 = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 8, examAngle);
    var pEx2 = polarToCartesian(CX, CY, R_WEEKS_TRACK - 16, examAngle);
    this.laserGroup.appendChild(createLaserBeam(pEx1, pEx2, '#D97706', true));
  };

  PregnancyWheel.prototype.renderOnWheelGuide = function (stepNumber, guideData) {
    this.activeGuide = { step: stepNumber, data: guideData };
    this.refreshOnWheelGuide();
  };

  PregnancyWheel.prototype.clearOnWheelGuide = function () {
    this.activeGuide = null;
    if (this.guideGroup) {
      this.guideGroup.innerHTML = '';
    }
  };

  PregnancyWheel.prototype.refreshOnWheelGuide = function () {
    if (!this.guideGroup || !this.activeGuide) return;
    this.guideGroup.innerHTML = '';

    var step = this.activeGuide.step;
    var data = this.activeGuide.data || {};
    var degPerDay = 360 / 365;

    if (step === 1) {
      // -------------------------------------------------------------
      // BƯỚC 1: CẦN XOAY NHƯ THẾ NÀO? (Thao tác tay & Đặt mốc)
      // -------------------------------------------------------------
      var targetDate = data.targetCalendarDate || data.lmpDate || new Date();
      var targetDay = getDayOfYear(targetDate);
      var targetCalendarAngle = (targetDay * degPerDay) % 360;

      // Outer calendar beacon
      var pCalendar = polarToCartesian(CX, CY, (R_CALENDAR_INNER + R_CALENDAR_OUTER) / 2, targetCalendarAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pCalendar.x, pCalendar.y, '#E11D48'));

      var pBadge = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 14, targetCalendarAngle);
      var targetLabel = data.scenarioType === 'crl' ? '🎯 NGÀY SIÊU ÂM: ' : (data.scenarioType === 'ivf' ? '🎯 NGÀY CHUYỂN PHÔI: ' : '🎯 NGÀY KINH CHÓT: ');
      targetLabel += formatDateShort(targetDate);
      this.guideGroup.appendChild(createClayBadge(pBadge.x, pBadge.y, targetLabel, '#E11D48', '#FFFDFB', '#E11D48'));

      // Inner disc target mark
      var innerMarkAngle = this.currentRotation;
      var markLabel = 'Kim Đỏ (LMP)';
      if (data.scenarioType === 'crl') {
        var crlDays = data.crlGADays || 87;
        innerMarkAngle = (this.currentRotation + crlDays * degPerDay) % 360;
        markLabel = 'Vạch ' + Math.floor(crlDays / 7) + 'w' + (crlDays % 7) + 'd';
      } else if (data.scenarioType === 'ivf') {
        var ivfDays = data.ivfAgeDays || 19;
        innerMarkAngle = (this.currentRotation + ivfDays * degPerDay) % 360;
        markLabel = 'Vạch ' + Math.floor(ivfDays / 7) + 'w' + (ivfDays % 7) + 'd';
      }

      var pInnerMark = polarToCartesian(CX, CY, R_INNER_DISC - 8, innerMarkAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pInnerMark.x, pInnerMark.y, '#F43F5E'));

      var angleDiff = Math.abs((targetCalendarAngle - innerMarkAngle + 360) % 360);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;

      if (angleDiff > 3) {
        var arrowGuidance = createCurvedRotationArrow(
          CX, CY, R_INNER_DISC + 4,
          innerMarkAngle, targetCalendarAngle,
          '#E11D48',
          '🖐️ XOAY ' + markLabel.toUpperCase() + ' VÀO ĐÂY'
        );
        this.guideGroup.appendChild(arrowGuidance);
      } else {
        var pSuccess = polarToCartesian(CX, CY, R_INNER_DISC - 28, targetCalendarAngle);
        var successBadge = createClayBadge(pSuccess.x, pSuccess.y, '✅ ĐÃ KHỚP MỐC THÀNH CÔNG!', '#059669', '#ECFDF5', '#059669');
        this.guideGroup.appendChild(successBadge);
      }

    } else if (step === 2) {
      // -------------------------------------------------------------
      // BƯỚC 2: ĐỌC DỰ SINH NHƯ THẾ NÀO? (Mắt nhìn EDD)
      // -------------------------------------------------------------
      var eddAngle = (this.currentRotation + 280 * degPerDay) % 360;
      var eddDate = data.eddDate || new Date();

      var pBeamStart = polarToCartesian(CX, CY, R_INNER_DISC - 16, eddAngle);
      var pBeamEnd = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 12, eddAngle);
      this.guideGroup.appendChild(createLaserBeam(pBeamStart, pBeamEnd, '#059669', true));

      var pEddBeacon = polarToCartesian(CX, CY, (R_CALENDAR_INNER + R_CALENDAR_OUTER) / 2, eddAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pEddBeacon.x, pEddBeacon.y, '#059669'));

      var pEddBadge = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 16, eddAngle);
      this.guideGroup.appendChild(createClayBadge(pEddBadge.x, pEddBadge.y, '🎯 ĐỌC DỰ SINH: ' + formatDateShort(eddDate) + ' (40w)', '#059669', '#ECFDF5', '#059669'));

      var pEyeBadge = polarToCartesian(CX, CY, R_INNER_DISC - 38, eddAngle);
      this.guideGroup.appendChild(createClayBadge(pEyeBadge.x, pEyeBadge.y, '👁️ MẮT NHÌN: Từ kim Xanh gióng thẳng ra đĩa ngoài', '#059669', '#FFFFFF', '#065F46'));

    } else if (step === 3) {
      // -------------------------------------------------------------
      // BƯỚC 3: ĐỌC TUỔI THAI NHƯ THẾ NÀO? (Dóng Ngày khám)
      // -------------------------------------------------------------
      var examDate = data.examDate || new Date();
      var examDay = getDayOfYear(examDate);
      var examAngle = (examDay * degPerDay) % 360;

      var gaWeeks = typeof data.gaWeeks === 'number' ? data.gaWeeks : 0;
      var gaDays = typeof data.gaDays === 'number' ? data.gaDays : 0;

      var pExamBeacon = polarToCartesian(CX, CY, (R_CALENDAR_INNER + R_CALENDAR_OUTER) / 2, examAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pExamBeacon.x, pExamBeacon.y, '#E11D48'));

      var pExamBadge = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 16, examAngle);
      this.guideGroup.appendChild(createClayBadge(pExamBadge.x, pExamBadge.y, '📅 NGÀY KHÁM: ' + formatDateShort(examDate), '#E11D48', '#FFFDFB', '#E11D48'));

      var pInStart = polarToCartesian(CX, CY, R_CALENDAR_OUTER + 10, examAngle);
      var pInEnd = polarToCartesian(CX, CY, R_WEEKS_TRACK - 22, examAngle);
      this.guideGroup.appendChild(createLaserBeam(pInStart, pInEnd, '#E11D48', true));

      var pWeekTarget = polarToCartesian(CX, CY, R_WEEKS_TRACK, examAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pWeekTarget.x, pWeekTarget.y, '#E11D48'));

      var pGaBadge = polarToCartesian(CX, CY, R_WEEKS_TRACK - 34, examAngle);
      this.guideGroup.appendChild(createClayBadge(pGaBadge.x, pGaBadge.y, '🔍 ĐỌC TUỔI THAI: ' + gaWeeks + 'w ' + gaDays + 'd', '#E11D48', '#FFF1F2', '#E11D48'));

      var pEyeIn = polarToCartesian(CX, CY, R_CALENDAR_INNER - 18, examAngle);
      this.guideGroup.appendChild(createClayBadge(pEyeIn.x, pEyeIn.y, '👁️ MẮT NHÌN: Từ ngày khám gióng thẳng vào đĩa trong', '#B91C1C', '#FFFFFF', '#4A1D24'));

    } else if (step === 4) {
      // -------------------------------------------------------------
      // BƯỚC 4: ĐỌC MỐC SÀNG LỌC & CHỈ ĐỊNH (Cung màu trên thước)
      // -------------------------------------------------------------
      var milestoneTitle = data.milestoneTitle || 'Khảo sát hình thái học';
      var milestoneRange = data.milestoneRange || '18 - 22 tuần';
      var msAngle = (this.currentRotation + (data.gaTotalDays || 140) * degPerDay) % 360;

      var arcDegStart = (msAngle - 18 + 360) % 360;
      var arcDegEnd = (msAngle + 18) % 360;
      var msArc = document.createElementNS(SVG_NS, 'path');
      msArc.setAttribute('d', describeArc(CX, CY, R_MILESTONE_TRACK - 8, R_MILESTONE_TRACK + 8, arcDegStart, arcDegEnd));
      msArc.setAttribute('fill', 'rgba(2, 132, 199, 0.25)');
      msArc.setAttribute('stroke', '#0284C7');
      msArc.setAttribute('stroke-width', '2');
      this.guideGroup.appendChild(msArc);

      var pMsBeacon = polarToCartesian(CX, CY, R_MILESTONE_TRACK, msAngle);
      this.guideGroup.appendChild(createPulsingBeacon(pMsBeacon.x, pMsBeacon.y, '#0284C7'));

      var pMsBadge = polarToCartesian(CX, CY, R_MILESTONE_TRACK - 28, msAngle);
      this.guideGroup.appendChild(createClayBadge(pMsBadge.x, pMsBadge.y, '🩺 CHỈ ĐỊNH: ' + milestoneTitle + ' (' + milestoneRange + ')', '#0284C7', '#F0F9FF', '#0369A1'));

      var pEyeMs = polarToCartesian(CX, CY, R_INNER_DISC - 20, msAngle);
      this.guideGroup.appendChild(createClayBadge(pEyeMs.x, pEyeMs.y, '👁️ MẮT NHÌN: Đối chiếu cung màu trên đĩa trong', '#0284C7', '#FFFFFF', '#0C4A6E'));
    }
  };

  PregnancyWheel.prototype.syncWithDate = function (date, onComplete) {
    if (!date) return;
    var dayOfYear = getDayOfYear(date);
    var degPerDay = 360 / 365;
    var targetRotation = (dayOfYear * degPerDay) % 360;
    this.animateSnap(targetRotation, onComplete);
  };

  PregnancyWheel.prototype.spinDemonstration = function (onComplete) {
    var self = this;
    var start = this.currentRotation;
    var startTime = performance.now();
    var duration = 1400; // ms

    function step(now) {
      var progress = Math.min(1, (now - startTime) / duration);
      var ease = Math.sin(progress * Math.PI / 2);
      var cur = start + 360 * ease;

      self.setRotation(cur, true);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        self.setRotation(start, true);
        if (typeof onComplete === 'function') onComplete();
      }
    }

    requestAnimationFrame(step);
  };

  return PregnancyWheel;
});
