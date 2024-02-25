// DOM elements
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create the audio element for the player
let curr_track = document.createElement('audio');

// Define the list of tracks that have to be played
let track_list = [
  {
    name: "Despacito",
    artist: "Luis Fonsi",
    image: "https://timesofindia.indiatimes.com/photo/msid-65293013,imgsize-103548.cms",
    path: "Despacito.mp3"
  },
  {
    name: "Wakhra Swag",
    artist: "Badshah",
    image: "https://c.saavncdn.com/903/Wakhra-Swag-Punjabi-2015-500x500.jpg",
    path: "Wakhra_Swag.mp3"
  },
  {
    name: "Cheap Thrills",
    artist: "Sia",
    image: "https://jesusful.com/wp-content/uploads/2022/07/Sia-Cheap-Thrills-ft.-Sean-Paul-Mp3-Download-Lyrics-300x169.jpg",
    path: "Cheap_Thrills.mp3"
  },
  {
    name: "They Don't Care About Us",
    artist: "Michael Jackson",
    image: "https://www.billboard.com/wp-content/uploads/2023/04/michael-jackson-they-dont-care-about-us-still-1996-billboard-1548.jpg?w=942&h=623&crop=1",
    path: "They_Don't_Care.mp3"
  },
  {
    name: "Show Me The Meaning",
    artist: "Back Street Boys",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OuWR-I32p_zrR49yFT6jxxJ9N0iav2HgPaWk1uF0sjb9YaiIVY8e_3tr8KcTDfZ9OMw&usqp=CAU",
    path: "show_me_the_meaning.mp3"
  }
];

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();
  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;
  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function random_bg_color() {
  let red1 = Math.floor(Math.random() * 256);
  let green1 = Math.floor(Math.random() * 256);
  let blue1 = Math.floor(Math.random() * 256);
  let red2 = Math.floor(Math.random() * 256);
  let green2 = Math.floor(Math.random() * 256);
  let blue2 = Math.floor(Math.random() * 256);
  let bgColor = `linear-gradient(45deg, rgb(${red1}, ${green1}, ${blue1}), rgb(${red2}, ${green2}, ${blue2})`;
  document.body.style.background = bgColor;
}
let isShuffle = false;

function toggleShuffle() {
  isShuffle = !isShuffle; // Toggle the shuffle state

  // Update the shuffle button appearance based on the state
  const shuffleButton = document.querySelector(".shuffle-button");
  if (isShuffle) {
    shuffleButton.style.color = "#3498db"; // Change color to indicate shuffle is active
  } else {
    shuffleButton.style.color = "white"; // Reset color
  }

  // If shuffle is active, shuffle the track list
  if (isShuffle) {
    shuffleTrackList();
  } else {
    // If shuffle is deactivated, reset the track list to its original order
    track_list.sort((a, b) => a.index - b.index);
  }
}

function shuffleTrackList() {
  // Create a copy of the original track list
  const originalTrackList = [...track_list];

  // Shuffle the copy using the Fisher-Yates algorithm
  for (let i = originalTrackList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [originalTrackList[i], originalTrackList[j]] = [originalTrackList[j], originalTrackList[i]];
  }

  // Update the track list with the shuffled copy
  track_list = originalTrackList;
}

// Make sure to call toggleShuffle initially to set the initial state
toggleShuffle();


function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1) {
    track_index += 1;
  } else {
    track_index = 0;
  }
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = track_list.length - 1;
  }
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;
  
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;
    
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
    
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }
    
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

loadTrack(track_index);