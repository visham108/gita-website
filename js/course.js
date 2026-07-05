/* ==========================================================================
   Course platform — enrollment, lesson completion, progress, quiz.
   State persisted in localStorage (syncs to account in production build).
   ========================================================================== */

(function () {
  "use strict";

  const KEY = "bgaii_course_v1";

  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { enrolled: false, done: {}, quiz: null }; }
    catch { return { enrolled: false, done: {}, quiz: null }; }
  };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));

  const allLessons = () => window.COURSE.flatMap((m) => m.lessons);

  function progress(state) {
    const total = allLessons().length;
    const done = allLessons().filter((l) => state.done[l.id]).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------------- Rendering ---------------- */

  function renderProgress(state) {
    const p = progress(state);
    const pctEl = document.querySelector("[data-progress-pct]");
    const fill = document.querySelector("[data-progress-fill]");
    const outer = document.querySelector("[data-progress-outer]");
    const label = document.querySelector("[data-progress-label]");
    const note = document.querySelector("[data-progress-note]");
    const cont = document.querySelector("[data-continue-slot]");
    if (!pctEl) return;

    pctEl.textContent = p.pct + "%";
    fill.style.width = p.pct + "%";
    outer.setAttribute("aria-valuenow", String(p.pct));

    if (!state.enrolled) {
      label.textContent = "Not yet enrolled";
      cont.innerHTML = "";
    } else if (p.pct === 100) {
      label.textContent = "Completed 🎉";
      note.textContent = "All 27 lessons complete. Your certificate is unlocked below — and the Gītā is now a lifelong companion.";
      cont.innerHTML = '<a class="btn btn--gold btn--block" href="#certificate">View Your Certificate</a>';
    } else {
      label.textContent = `${p.done} of ${p.total} lessons`;
      const next = allLessons().find((l) => !state.done[l.id]);
      note.textContent = "Enrolled — your progress is saved on this device.";
      cont.innerHTML = next
        ? `<button class="btn btn--gold btn--block" type="button" data-goto-lesson="${next.id}">Continue: ${next.title}</button>`
        : "";
    }

    // Certificate state
    const certStatus = document.querySelector("[data-cert-status]");
    const certName = document.querySelector("[data-cert-name]");
    if (certStatus) {
      if (p.pct === 100) {
        certStatus.textContent = "Unlocked — congratulations!";
        certStatus.style.background = "rgba(255,217,163,.28)";
        certStatus.style.color = "#ffe3b8";
        if (certName) certName.textContent = "a dedicated student of the Gītā";
      } else {
        certStatus.textContent = `Locked — ${p.total - p.done} lesson${p.total - p.done === 1 ? "" : "s"} to go`;
      }
    }
  }

  function renderCurriculum(state) {
    const box = document.querySelector("[data-curriculum]");
    if (!box) return;

    box.innerHTML = window.COURSE.map((m, mi) => {
      const doneCount = m.lessons.filter((l) => state.done[l.id]).length;
      const pct = Math.round((doneCount / m.lessons.length) * 100);
      const lessons = m.lessons.map((l) => `
        <li>
          <button class="lesson${state.done[l.id] ? " is-done" : ""}" type="button" data-lesson="${l.id}" aria-pressed="${!!state.done[l.id]}">
            <span class="lesson__check" aria-hidden="true">✓</span>
            <span><strong>${l.title}</strong></span>
            <span>${l.time}</span>
          </button>
        </li>`).join("");

      return `<details class="module reveal is-visible"${mi === 0 ? " open" : ""}>
        <summary>
          <span class="module__num" aria-hidden="true">${mi + 1}</span>
          <span class="module__meta"><strong>${m.title}</strong><span>${m.time}</span></span>
          <span class="module__progress">${doneCount}/${m.lessons.length} complete
            <span class="progress-bar"><i style="width:${pct}%"></i></span>
          </span>
        </summary>
        <ul class="lesson-list">${lessons}</ul>
      </details>`;
    }).join("");
  }

  /* ---------------- Quiz ---------------- */

  let quizAnswers = {};

  function renderQuiz(state) {
    const box = document.querySelector("[data-quiz]");
    if (!box) return;

    box.innerHTML = window.QUIZ_M1.map((q, qi) => {
      const chosen = quizAnswers[qi];
      const options = q.options.map((opt, oi) => {
        let cls = "quiz-option";
        if (chosen !== undefined) {
          if (oi === q.answer) cls += " is-correct";
          else if (oi === chosen) cls += " is-wrong";
        }
        return `<button class="${cls}" type="button" data-quiz-pick="${qi}:${oi}" ${chosen !== undefined ? "disabled" : ""}>
          <span class="quiz-option__key" aria-hidden="true">${"ABCD"[oi]}</span>
          <span>${opt}</span>
        </button>`;
      }).join("");

      return `<div class="card" style="cursor:default">
        <p style="font-weight:650; margin-bottom:var(--space-4)">${qi + 1}. ${q.q}</p>
        <div class="stack-3">${options}</div>
        ${chosen !== undefined ? `<p class="mt-4" style="font-size:var(--text-sm); color:var(--ink-soft); border-left:3px solid var(--gold); padding-left:1em; margin-bottom:0">${q.why}</p>` : ""}
      </div>`;
    }).join("");

    const resultBox = document.querySelector("[data-quiz-result]");
    const answered = Object.keys(quizAnswers).length;
    if (answered === window.QUIZ_M1.length) {
      const score = window.QUIZ_M1.reduce((s, q, qi) => s + (quizAnswers[qi] === q.answer ? 1 : 0), 0);
      state.quiz = score;
      save(state);
      resultBox.innerHTML = `<div class="card card--night" style="display:inline-block; padding:var(--space-5) var(--space-7)">
        <strong style="font-family:var(--font-display); font-size:var(--text-xl); color:var(--gold-bright)">${score} / ${window.QUIZ_M1.length}</strong>
        <p style="color:var(--moon-soft); margin:0.4rem 0 0">${score === 3 ? "Perfect — you are ready for Module 2." : "Well tried — the lessons will make these second nature."}
        <button class="btn btn--ghost-dark btn--sm" type="button" data-quiz-retry style="margin-left:.8em">Retry</button></p>
      </div>`;
    } else {
      resultBox.innerHTML = "";
    }
  }

  /* ---------------- Events ---------------- */

  function handleClick(e, state) {
    const enroll = e.target.closest("[data-enroll]");
    if (enroll) {
      if (!state.enrolled) {
        state.enrolled = true;
        save(state);
        Site.toast("Welcome to Gītā Foundations! Module 1 awaits below.");
        renderProgress(state);
      } else {
        Site.toast("You are already enrolled — continue where you left off.");
      }
      document.getElementById("curriculum").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const goto = e.target.closest("[data-goto-lesson]");
    if (goto) {
      const id = goto.dataset.gotoLesson;
      const btn = document.querySelector(`[data-lesson="${id}"]`);
      if (btn) {
        btn.closest("details").open = true;
        btn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const lesson = e.target.closest("[data-lesson]");
    if (lesson) {
      const id = lesson.dataset.lesson;
      if (!state.enrolled) {
        state.enrolled = true;
        Site.toast("Enrolled! Lesson marked complete.");
      }
      state.done[id] = !state.done[id];
      save(state);
      renderCurriculum(state);
      renderProgress(state);
      const p = progress(state);
      if (state.done[id] && p.pct === 100) {
        Site.toast("🎉 Course complete! Your certificate is unlocked.");
      }
      return;
    }

    const pick = e.target.closest("[data-quiz-pick]");
    if (pick) {
      const [qi, oi] = pick.dataset.quizPick.split(":").map(Number);
      if (quizAnswers[qi] === undefined) {
        quizAnswers[qi] = oi;
        renderQuiz(state);
      }
      return;
    }

    if (e.target.closest("[data-quiz-retry]")) {
      quizAnswers = {};
      renderQuiz(state);
      document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
    }
  }

  function init() {
    const state = load();
    renderProgress(state);
    renderCurriculum(state);
    renderQuiz(state);
    document.addEventListener("click", (e) => handleClick(e, state));
  }

  window.Course = { init };
})();
