const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = () => {
  navigator
    .mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(stream => {
      console.log(stream)
      video.src = window.URL.createObjectURL(stream)
      video.play()
    })
    .catch(err => {
      console.error(err)
    })
}

const inputs = document.querySelectorAll('.rgb input')

const filters = {
  red: (p) => {
    for (let i = 0; i < p.data.length; i += 4) {
      const ri = i + 0
      const gi = i + 1
      const bi = i + 2
      const ai = i + 3
      p.data[ri] += 100
      p.data[gi] -= 50
      p.data[bi] *= 0.5
    }
    return p
  },
  split: (p) => {
    for (let i = 0; i < p.data.length; i += 4) {
      const ri = i + 0
      const gi = i + 1
      const bi = i + 2
      const ai = i + 3
      p.data[i - 300] = p.data[ri]
      p.data[i + 100] = p.data[gi]
      p.data[i - 450] = p.data[bi]
    }
    return p
  },
  greenScreen: (p) => {
    const levels = {}

    inputs.forEach(i => levels[i.name] = i.value)

    for (i = 0; i < p.data.length; i = i + 4) {
      red = p.data[i + 0]
      green = p.data[i + 1]
      blue = p.data[i + 2]
      alpha = p.data[i + 3]

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        p.data[i + 3] = 0
      }
    }

    return p
  }
}

const toCanvas = () => {
  const w = video.videoWidth
  const h = video.videoHeight
  canvas.width = w
  canvas.height = h

  const render = () => {
    ctx.drawImage(video, 0, 0, w, h)

    let p = ctx.getImageData(0, 0, w, h)

    // p = filters.red(p)

    p = filters.split(p)

    // p = filters.greenScreen(p)

    // ctx.globalAlpha = 0.1

    ctx.putImageData(p, 0, 0)

    window.requestAnimationFrame(render)
  }
  window.requestAnimationFrame(render)
}

const takePhoto = () => {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
  strip.insertBefore(link, strip.firstChild)
}

video.addEventListener('canplay', toCanvas)
getVideo()
