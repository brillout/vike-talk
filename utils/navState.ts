export { setIsNavigating, getIsNavigating }

let isNavigating = false

function setIsNavigating(v: boolean): void {
  isNavigating = v
}

function getIsNavigating(): boolean {
  return isNavigating
}
