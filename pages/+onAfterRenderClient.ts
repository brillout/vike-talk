import { navigate } from 'vike/client/router'

export default () => {
  autoRedirect()
}

async function autoRedirect() {
  const { pathname } = window.location
  const slideNumber = parseInt(pathname.slice(1), 10)
  if (isNaN(slideNumber)) {
    navigate(`/1`)
  }
}
