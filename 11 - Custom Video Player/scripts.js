const player = document.querySelector('.player')
const progress = document.querySelector('.progress')
const progressFilled = document.querySelector('.progress__filled')
const video = document.querySelector('.viewer')
const toggle = document.querySelector('.toggle')
const skips = document.querySelectorAll('button[data-skip]')
const sliders = document.querySelectorAll('.player__slider')

const togglePlay = () => video[video.paused ? 'play' : 'pause']()

const updatePlayBtn = () => (toggle.innerHTML = video.paused ? '►' : '❚ ❚')

const updateProgress = () =>
  (progressFilled.style.flexBasis = `${(video.currentTime / video.duration) *
    100}%`)

const handleChangeProg = e =>
  (video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration)

const handleChangeSlider = e =>
  (video[e.currentTarget.name] = e.currentTarget.value)

const handleSkip = time => (video.currentTime += time)

skips.forEach(s =>
  s.addEventListener('click', () => handleSkip(parseFloat(s.dataset.skip))),
)

sliders.forEach(s => s.addEventListener('change', handleChangeSlider))
sliders.forEach(s => s.addEventListener('mousemove', handleChangeSlider))

toggle.addEventListener('click', togglePlay)

video.addEventListener('click', togglePlay)
video.addEventListener('play', updatePlayBtn)
video.addEventListener('pause', updatePlayBtn)
video.addEventListener('timeupdate', updateProgress)

let isMouseDown = false
progress.addEventListener('mousemove', e => isMouseDown && handleChangeProg(e))
progress.addEventListener('mousedown', () => (isMouseDown = true))
progress.addEventListener('mouseup', e => {
  isMouseDown = false
  handleChangeProg(e)
})

video.addEventListener('loadedmetadata', () => video.play())

document.addEventListener('keydown', e => {
  if (e.keyCode === 32) togglePlay()
  if (e.keyCode === 39) handleSkip(5)
  if (e.keyCode === 37) handleSkip(-5)
})
