const timeLeft = document.querySelector('.display__time-left')
const endTimeEl = document.querySelector('.display__end-time')

let interval

const addZero = n => ('0' + n).slice(-2)

const render = endTime => {
  const rest = Math.round((endTime - Date.now()) / 1000)
  const mins = Math.floor(rest / 60)
  const secs = rest % 60
  timeLeft.textContent = `${addZero(mins)}:${addZero(secs)}`
  if (rest <= 0) {
    clearInterval(interval)
    return
  }
}

const timer = time => {
  if (interval) clearInterval(interval)

  const endTime = Date.now() + time * 1000
  const endDate = new Date(endTime)
  endTimeEl.textContent = `The end at ${endDate.getHours()}:${addZero(
    endDate.getMinutes(),
  )}`

  render(endTime)
  interval = setInterval(() => render(endTime), 1000)
}

document
  .querySelectorAll('.timer__button')
  .forEach(el =>
    el.addEventListener('click', e =>
      timer(Number(e.currentTarget.dataset.time)),
    ),
  )

document
  .querySelector('form[name="customForm"]')
  .addEventListener('submit', e => {
    e.preventDefault()
    const form = e.currentTarget
    timer(Number(form.minutes.value * 60))
    form.reset()
  })
