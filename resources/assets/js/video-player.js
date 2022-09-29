const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const fullscreenBtn = document.querySelector(".fullscreen-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const muteBtn = document.querySelector(".mute-btn");
const captionsBtn = document.querySelector(".caption-btn");
const settingsBtn = document.querySelector(".settings-btn");
const currentTimeElem = document.querySelector(".current-time");
const totalTimeElem = document.querySelector(".total-time");
const volumeSlider = document.querySelector(".volume-slider");
const settingsContainer = document.querySelector(".settings-container");
const settingsHome = document.querySelectorAll(".settings-container [data-label='settingsHome'] > ul > li");
const videoContainer = document.querySelector(".video-container");
const timelineContainer = document.querySelector(".timeline-container");
const thumbIndicator = document.querySelector(".thumb-indicator");
const video = document.querySelector("video");
const videoControlsContainer = document.querySelector(".video-controls-container");
const playback = document.querySelectorAll(".playback-speed li");
const loader = document.querySelector(".loader");
const bufferedBar = document.querySelector(".bufferedBar");
// const btnMenu = document.querySelector(".menu-icon-btn");
// const sidebar = document.querySelector(".sidebar");

document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase()
    if(tagName === "input") return

    switch (e.key.toLowerCase()) {
        case " ":
            if(tagName === "button") return
        case "k":
            togglePlay()
        break
        case "f":
            toggleFullscreeMode()
        break
        case "t":
            toggleTheaterMode()
        break
        case "i":
            toggleMiniPlayerMode()
        break
        case "m":
            toggleMute()
        break
        case "arrowleft":
        case "j":
            skip(-5)
        break;
        case "arrowright":
        case "l":
            skip(5)
        break;
        case "c":
            toggleCaptions()
        break
    }
})
  video.addEventListener('waiting', () => {
    loader.style.display = "block";
  })
  
  video.addEventListener('canplay', () => {
    loader.style.display = "none";
  })

// blob url
let mainVideoSources = video.querySelectorAll("source");
for (let i = 0; i < mainVideoSources.length; i++) {
  let videoUrl = mainVideoSources[i].src;
  blobUrl(mainVideoSources[i], videoUrl);
}
function blobUrl(video, videoUrl) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", videoUrl);
  xhr.responseType = "arraybuffer";
  xhr.onload = (e) => {
    let blob = new Blob([xhr.response]);
    let url = URL.createObjectURL(blob);
    video.src = url;
  };
  xhr.send();
}

video.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Autoplay

// Settings / Playback / Quality

settingsBtn.addEventListener("click", toggleSettings);

function toggleSettings(){
    settingsContainer.classList.toggle('active');
    settingsBtn.classList.toggle('active');
}

// Playback
playback.forEach((event) => {
    event.addEventListener("click", () =>{
        removeActiveClasses(playback);
        event.classList.add("active");
        let speed = event.getAttribute('data-playback-speed');
        video.playbackRate = speed;
    });
})

const settingDivs = document.querySelectorAll(".settings-container > div");
const settingsBack = document.querySelectorAll(".settings-container > div > span");
const quality_ul = document.querySelector(".settings-container > [data-label='quality'] ul");
const qualities = document.querySelectorAll("source[size]");

qualities.forEach(event=>{
  let quality_html = `<li data-quality="${event.getAttribute('size')}">${event.getAttribute('size')}p</li>`;
  quality_ul.insertAdjacentHTML('afterbegin',quality_html);
})

const quality_li = document.querySelectorAll(".settings-container > [data-label='quality'] > ul > li");
quality_li.forEach((event)=>{
  event.addEventListener('click',(e)=>{
    let quality = event.getAttribute('data-quality');
    removeActiveClasses(quality_li);
    event.classList.add('active');
    qualities.forEach(event=>{
      if (event.getAttribute('size') == quality) {
        let video_current_duration = video.currentTime;
        let video_source = event.getAttribute('src');
        video.src = video_source;
        video.currentTime = video_current_duration;
        if(videoContainer.classList.contains("paused")) {
            video.pause();
        }
        else{
            video.play();
        }
      }
    })
  })
})

console.log(settingDivs);
console.log(settingsBack);
console.log(settingsHome);
settingsBack.forEach((event)=>{
  event.addEventListener('click',(e)=>{
    let setting_label = e.target.getAttribute('data-label')
    for (let i = 0; i < settingDivs.length; i++) {
      if (settingDivs[i].getAttribute('data-label') == setting_label) {
        settingDivs[i].removeAttribute('hidden');
      }
      else{
        settingDivs[i].setAttribute('hidden',"");
      }
    }
  })
})
  
  settingsHome.forEach((event)=>{
    event.addEventListener('click',(e)=>{
      console.log(e.target);
      let setting_label = e.target.getAttribute('data-label');
      for (let i = 0; i < settingDivs.length; i++) {
        if (settingDivs[i].getAttribute('data-label') == setting_label) {
          settingDivs[i].removeAttribute('hidden');
        }else{
          settingDivs[i].setAttribute('hidden',"");
        }
      }
    })
  })

  function removeActiveClasses(e) {
    e.forEach((event) => {
      event.classList.remove("active");
    });
  }

// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", (e) => {
    if(isScrubbing) toggleScrubbing(e);
})
document.addEventListener("mousemove", (e) => {
    if(isScrubbing) handleTimelineUpdate(e);
})


let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if(isScrubbing) {
        wasPaused = video.paused
        video.pause();
    }else {
        video.currentTime = percent * video.duration
        if(!wasPaused) video.play()
    }
    handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty("--preview-position", percent);
    if(isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty("--progress-position", percent);
    }
}

// Captions
const captions = video.textTracks[0];
captions.mode = "hidden";

captionsBtn.addEventListener("click", toggleCaptions);

function toggleCaptions() {
    const isHidden = captions.mode === "hidden";
    captions.mode = isHidden ? "showing" : "hidden";
    videoContainer.classList.toggle("captions", isHidden);
}

// Duration
video.addEventListener("loadeddata", () => {
    totalTimeElem.textContent = formatDuration(video.duration)
  })
video.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", percent);
});
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
});
function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if(hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)
        }:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip (duration) {
    video.currentTime += duration;
}

// Volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
});

function toggleMute () {
    video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
    volumeSlider.value = video.volume;
    let volumeLevel;
    if(video.muted || video.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = "muted"
    } else if (video.volume >= 0.5) {
        volumeLevel = "high"
    } else {
        volumeLevel = "low"
    }
    videoContainer.dataset.volumeLevel = volumeLevel;
});

// View Modes
theaterBtn.addEventListener("click", toggleTheaterMode);
fullscreenBtn.addEventListener("click", toggleFullscreeMode);
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

function toggleTheaterMode () {
    videoContainer.classList.toggle("theater");
}
function toggleFullscreeMode () {
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen();
    }else {
        document.exitFullscreen();
    }
}
function toggleMiniPlayerMode () {
    if(videoContainer.classList.contains("mini-player")){
        document.exitPictureInPicture();
    }else {
        video.requestPictureInPicture();
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen", 
    document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player");
});

// Play/Pause
playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused");
});

// btnMenu.addEventListener("click", toggleSideBar)

// function toggleSideBar() {
//   sidebar.classList.toggle("collapsed")
// }