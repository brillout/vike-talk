export { getCurrentStep, getTotalSteps, indexAndApply, nextStep, prevStep }

const SELECTOR = '#slide-content .reveal'

function getCurrentStep(): number {
  const n = parseInt(window.location.hash.slice(1), 10)
  return isNaN(n) ? 0 : n
}

function getTotalSteps(): number {
  return document.querySelectorAll(SELECTOR).length
}

function indexAndApply() {
  const els = document.querySelectorAll<HTMLElement>(SELECTOR)
  els.forEach((el, i) => {
    el.dataset.revealStep = String(i + 1)
  })
  apply()
}

function apply() {
  const cur = getCurrentStep()
  const els = document.querySelectorAll<HTMLElement>(SELECTOR)
  els.forEach((el) => {
    const step = parseInt(el.dataset.revealStep || '0', 10)
    if (step <= cur) {
      el.dataset.revealed = 'true'
    } else {
      delete el.dataset.revealed
    }
  })
}

function nextStep(): boolean {
  const cur = getCurrentStep()
  const total = getTotalSteps()
  if (cur >= total) return false
  history.pushState(null, '', `#${cur + 1}`)
  apply()
  return true
}

function prevStep(): boolean {
  const cur = getCurrentStep()
  if (cur <= 0) return false
  const next = cur - 1
  const url = next === 0 ? window.location.pathname : `#${next}`
  history.pushState(null, '', url)
  apply()
  return true
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', apply)
}
