import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-platform',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="about-page fade-in">
        <a routerLink="/questions" class="back-link">< Back to Questions</a>

        <section class="about-hero">
          <div class="hero-copy">
            <span class="eyebrow">About the Platform</span>
            <h1>Why DoConnect Community Q&amp;A and Collaboration Platform was created</h1>
            <p>
              DoConnect was created to make technical help feel more human, more organized,
              and easier to reuse. Instead of losing solutions in chats or scattered notes,
              this platform brings real questions, clear answers, screenshots, reviews,
              and collaboration into one place.
            </p>
          </div>
          <div class="hero-aside">
            <div class="mini-card">
              <span class="mini-label">Created By</span>
              <strong>Arun</strong>
              <p>Built as a capstone project to support practical problem solving across frontend, backend, and database work.</p>
            </div>
          </div>
        </section>

        <section class="about-grid">
          <article class="about-card">
            <h2>Why this platform was needed</h2>
            <p>
              During learning and project work, many problems repeat: UI issues, API errors,
              database doubts, validation bugs, login problems, or confusion during integration.
              A shared Q&amp;A space helps people solve those problems once and reuse the answer later.
            </p>
          </article>

          <article class="about-card">
            <h2>What makes DoConnect useful</h2>
            <ul>
              <li>Users can ask practical questions and post answers.</li>
              <li>Screenshots can be added where visual explanation matters.</li>
              <li>Admins can moderate content and keep the platform clean.</li>
              <li>Notifications and community connection features make the platform collaborative.</li>
            </ul>
          </article>

          <article class="about-card">
            <h2>Who it is for</h2>
            <p>
              It is useful for learners, team members, developers, and admins who want one place
              to track issues, solutions, reviews, and shared technical knowledge.
            </p>
          </article>

          <article class="about-card">
            <h2>Project idea in one line</h2>
            <p>
              DoConnect is a community-driven support platform where every question can become a reusable solution.
            </p>
          </article>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .about-page { padding: 36px 0 56px; max-width: 1120px; margin: 0 auto; }
    .back-link { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; display: inline-block; margin-bottom: 20px; }
    .back-link:hover { color: var(--accent); }
    .about-hero {
      display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 20px;
      padding: 28px; margin-bottom: 24px; border-radius: 28px;
      border: 1px solid var(--border); background:
        radial-gradient(circle at top left, rgba(72,111,178,0.12), transparent 28%),
        linear-gradient(135deg, rgba(255,255,255,0.96), rgba(247,241,230,0.98));
      box-shadow: var(--shadow);
    }
    .eyebrow {
      display: inline-block; margin-bottom: 12px; padding: 5px 12px;
      border-radius: 999px; background: rgba(72,111,178,0.1); color: var(--accent);
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .hero-copy h1 { margin-bottom: 14px; font-size: 2.8rem; line-height: 1.06; }
    .hero-copy p { color: var(--text-secondary); font-size: 1.02rem; max-width: 760px; line-height: 1.7; }
    .hero-aside { display: flex; align-items: stretch; }
    .mini-card {
      width: 100%; padding: 20px; border-radius: 22px; background: rgba(255,255,255,0.86);
      border: 1px solid rgba(217,205,187,0.9); box-shadow: var(--shadow);
    }
    .mini-label {
      display: inline-block; margin-bottom: 10px; padding: 4px 10px; border-radius: 999px;
      background: var(--accent-glow); color: var(--accent); font-size: 0.74rem; font-weight: 700;
    }
    .mini-card strong { display: block; font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 10px; }
    .mini-card p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .about-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 22px;
      padding: 22px; box-shadow: var(--shadow);
    }
    .about-card h2 { font-size: 1.2rem; margin-bottom: 10px; }
    .about-card p, .about-card li { color: var(--text-secondary); line-height: 1.65; font-size: 0.96rem; }
    .about-card ul { padding-left: 18px; display: flex; flex-direction: column; gap: 10px; }
    @media (max-width: 900px) {
      .about-hero, .about-grid { grid-template-columns: 1fr; }
      .hero-copy h1 { font-size: 2.3rem; }
    }
  `]
})
export class AboutPlatformComponent {}
