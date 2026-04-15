# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **(주)네오비플랜** — a Seoul-registered 정비사업전문관리업체 (urban redevelopment/maintenance project management company). No build system, no package manager, no framework. Open `index.html` directly in a browser to preview.

## Git & Deployment

- **Repository**: https://github.com/jhey-biz/neobplan
- **Live site**: https://jhey-biz.github.io/neobplan/
- **Branch**: `main` → GitHub Pages serves from repo root (`/`)
- **`gh` CLI path on Windows**: `/c/Program Files/GitHub CLI/gh.exe` — add to PATH with `export PATH="$PATH:/c/Program Files/GitHub CLI"` if `gh` is not found in the current shell session
- **Tracked data files**: only `data/CI/PNG/WHITE.png` is committed; all other `data/` files are git-ignored (see `.gitignore`)

Typical update flow:
```bash
git add <files>
git commit -m "설명"
git push
```
If push is rejected (remote has newer commits): `git pull --rebase` then `git push`.

## File Structure

```
index.html          — full single-page website (all 10 content sections)
css/style.css       — all styling (~1,840 lines)
js/main.js          — all client-side behaviour (~200 lines)
data/
  네오비플랜 지명원(2025.05).pdf   — source document (company info, projects)
  CI/
    PNG/GREEN.png   — primary logo for web (transparent bg, green)
    PNG/WHITE.png   — logo for dark backgrounds (used in navbar & footer)
    PNG/BLACK.png   — logo for light backgrounds
    RGB_1.jpg       — horizontal lockup reference
    원본.ai         — Illustrator source (do not modify)
```

## Brand & Design System

**Font**: `Noto Sans KR` (weights 300–900) loaded from Google Fonts — the sole typeface used site-wide.

**CSS custom properties** are defined in `:root` (`css/style.css:14`). Always use these tokens, never hardcode hex values:

| Token | Value | Use |
|---|---|---|
| `--green` | `#3aaa35` | Primary brand colour |
| `--green-dark` | `#2d8a29` | Hover / darker variant |
| `--green-light` | `#4dc447` | Lighter green tint |
| `--navy-dark` | `#0d1b3e` | Hero/dark section bg |
| `--navy` | `#1a2a5e` | Navy general |
| `--navy-mid` | `#243470` | Org chart lines, cards |
| `--orange` | `#e8761a` | Accent (highlights, strengths) |
| `--orange-light` | `#f28c35` | Lighter orange tint |
| `--gray-100` | `#f0f2f5` | Section alternate bg |
| `--gray-200` | `#e0e4ec` | Borders, dividers |
| `--gray-400` | `#9aa3b8` | Placeholder / muted text |
| `--gray-600` | `#5a6480` | Secondary text |
| `--gray-800` | `#2d3352` | Dark secondary text |
| `--text-dark` | `#1a1f36` | Default body text |
| `--text-mid` | `#3d4466` | Subtitles, descriptions |
| `--shadow-sm/md/lg` | — | Box shadow scale |
| `--radius-sm/md/lg/xl` | 8/16/24/40px | Border radius scale |
| `--transition` | `0.35s cubic-bezier(...)` | All animations |

Logo paths referenced in HTML: `data/CI/PNG/WHITE.png` (navbar/footer) and `data/CI/PNG/GREEN.png` (light-bg contexts). Additional CI assets in `data/CI/` include CMYK and numbered variants — see `data/CI/로고기본메뉴얼.pdf` for usage rules.

## Page Sections

Sections are `<section id="...">` in this order:

| id | Content |
|---|---|
| `hero` | Full-screen hero with animated stats counters |
| `greeting` | 대표 인사말 (CEO message, 박창선 배상) |
| `overview` | 회사개요 + 주요자문업체 |
| `goal` | 사업목표 |
| `ceo` | 조직 소개 — COO 이의홍 career timeline |
| `org` | 회사조직도 |
| `services` | 주요 업무수행 |
| `strengths` | 업무 특장점 |
| `projects` | 주요 업무수행실적 (9 project cards) |
| `other-projects` | 기타 업무수행실적 (20-row table) |
| `contact` | 연락처 |

## Org Chart Architecture

The org chart (`#org`) uses a **percentage-based explicit layout** (not a CSS tree/`ul li` approach). Key classes in `css/style.css:1152–1248`:

- `.ochart` — flex column, `align-items: center`, max-width 640px
- `.oc-fork-wide` — `width: 50%` fork; auto-centered → horizontal bar spans exactly between both L1 child centres (25% and 75%)
- `.oc-left-sub` — `width: 50%; align-self: flex-start` — left subtree container; its `align-items: center` places content at 25% of total width, directly below 대표이사
- `.oc-fork-narrow` — `width: 50%` of `.oc-left-sub` → spans 기획·관리팀 and 수주·영업팀 centres
- `.oc-arm-l / .oc-arm-r` — `border-bottom + border-right/left` creates the ─┬─ T-junction connector

**Do not switch this to a `ul/li` CSS tree** — asymmetric depth (대표이사 has 3 levels, 경영지원본부 is a leaf) causes column widths to diverge.

## JavaScript Behaviour (`js/main.js`)

All logic runs on `DOMContentLoaded`. Key features:

- **Navbar scroll**: adds `.scrolled` class after 60px scroll (glassmorphism bg)
- **Back-to-top**: `.back-top` button gains `.visible` class after 400px scroll
- **Active nav link**: `IntersectionObserver` (threshold 0.35) adds `.active` to the matching `.nav-link` as sections scroll into view
- **Scroll reveal**: `IntersectionObserver` adds `.revealed` to `.reveal`, `.reveal-left`, `.reveal-right` elements (fire-once, then unobserved)
- **Counters**: `IntersectionObserver` triggers number animation for `.counter[data-target][data-suffix]`; `data-counted` attribute guards against re-firing
- **Mobile menu**: `.hamburger` toggles `.active` on itself and `.open` on `.mobile-menu`; any nav link click closes the menu
- **Smooth scroll**: all `a[href^="#"]` clicks scroll with a **72px offset** (navbar height) — account for this when placing new anchor targets
- **Tilt effect**: mouse-move 3D perspective tilt on `.project-card`
- **Particles**: 15 animated green dots injected into `.hero-bg-pattern` at runtime

## CSS Conventions

- Section wrappers alternate `background: white` / `background: var(--gray-100)` / dark navy gradient
- Dark sections (`.hero`, `.goal`, `.contact`) use `color: white` overrides inline on `.section-title`
- Scroll animation classes: add `reveal` (fade up), `reveal-left`, `reveal-right` to any element; `reveal-delay-1` through `reveal-delay-5` for stagger
- Responsive breakpoints: 1024px (hide desktop nav → hamburger), 768px (stack grids), 480px (compact padding)

## Content Source

All company content originates from `data/네오비플랜 지명원(2025.05).pdf`. When updating text, cross-reference this PDF. Key facts:

- 법인설립: 2011년 5월 31일 / 사업자등록번호: 211-88-61342
- 정비사업전문관리업 등록번호: 제 2023-32호 (서울특별시, 2023.10.31)
- **현재 대표**: 박창선 (PDF 원본의 이의홍에서 변경됨 — 이의홍은 COO로 재직 중)
- 주소: 서울시 강서구 방화대로 34길 92, 305호
- 전화: 02)596-5500 / 팩스: 0303)3441-3154
