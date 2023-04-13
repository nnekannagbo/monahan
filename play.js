window.addEventListener("load", (event) => {
  var myLang = localStorage["lang"] || "defaultValue";
  var player;
  var audioContext = null;
  var gainNode = null;
  var previousVolume = "100";
  var timerInterval;
  var timerDuration;

  let playState = "play";
  let muteState = "unmute";
  let hasSkippedToEnd = false;

  function startplayer() {
    player = document.getElementById("music_player");
    player.controls = false;
  }

  function change_vol(event) {
    gainNode.gain.value = parseFloat(event.target.value);
  }

  // https://css-tricks.com/lets-create-a-custom-audio-player/
  function createHTMLMusicPlayer(musicPlayerDiv, musicPlayerh1) {
    // wrapper div
    let wrapperDiv = document.createElement("div");
    wrapperDiv.id = "wrapper";
    musicPlayerDiv.append(wrapperDiv);

    // player div
    let audioPlayerContainer = document.createElement("div");
    audioPlayerContainer.id = "audio-player-container";
    wrapperDiv.append(audioPlayerContainer);

    // music player audio element
    let musicPlayer = document.createElement("audio");
    musicPlayer.id = "music_player";
    audioPlayerContainer.append(musicPlayer);

    // inputs
    let currTime = document.createElement("span");
    currTime.classList.add("time");
    currTime.id = "current-time";
    currTime.innerHTML = "0:00";
    audioPlayerContainer.append(currTime);

    let playIconContainer = document.createElement("button");
    playIconContainer.id = "play-icon";
    playIconContainer.classList.add("play-icon");
    playIconContainer.classList.add("paused");
    // playIconContainer.innerHTML = "pause";
    audioPlayerContainer.append(playIconContainer);

    playIconContainer.addEventListener("click", () => {
      if (playState === "play") {
        // playIconContainer.innerHTML = "play";
        playIconContainer.classList.remove("paused");
        playState = "pause";
        audioContext.suspend();
        clearInterval(timerInterval);
      } else {
        player.currentTime = 0;
        // playIconContainer.innerHTML = "pause";
        playIconContainer.classList.add("paused");
        playState = "play";
        audioContext.resume();
        timerInterval = createTimerLoop(timerDuration);
      }
    });

    let volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.id = "volume-slider";
    volumeSlider.max = "100";
    volumeSlider.min = "0";
    volumeSlider.value = "100";
    audioPlayerContainer.append(volumeSlider);
    volumeSlider.addEventListener("change", (event) => {
      gainNode.gain.value = getCurrentSliderVolume();
    });

    function getCurrentSliderVolume() {
      let value = volumeSlider.value;
      return parseFloat(value) / 100;
    }

    let exitBtn = document.createElement("button");
    exitBtn.innerHTML = "exit";
    // exitBtn.type = "submit";
    exitBtn.name = "exitBtn";
    exitBtn.id = "exitBtn";
    exitBtn.classList.add("btn");
    musicPlayerDiv.appendChild(exitBtn);

    exitBtn.addEventListener("click", (event) => {
      audioContext.suspend();
      clearInterval(timerInterval);

      musicPlayerh1.innerHTML = "Thank you for joining us";
      document.getElementById("wrapper").remove();
      document.getElementById("exitBtn").remove();

      let beginAgainBtn = document.createElement("button");
      beginAgainBtn.innerHTML = "Begin again";
      beginAgainBtn.name = "beginAgainBtn";
      beginAgainBtn.classList.add("beginAgainBtn");
      musicPlayerDiv.appendChild(beginAgainBtn);

      beginAgainBtn.addEventListener("click", (event) => {
        window.location.href = "monahan.html";
      });
    });

    startplayer();
    timerInterval = createTimerLoop(0);
  }

  function displayLoadingGif() {
    let musicPlayerDiv = document.getElementById("musicPlayerDiv");
    let musicPlayerh1 = document.getElementById("musicPlayerH1");
    // need language logic here
    musicPlayerh1.innerHTML =
      "Generating beautiful sounds for you, this might take a minute";
    document.getElementById("launchMusicPlayerForm").remove();
    document.getElementById("textTranscript").remove();
    // temp loader content
    let loaderDiv = document.createElement("div");
    loaderDiv.classList.add("loader");
    musicPlayerDiv.append(loaderDiv);
    setTimeout(() => {
      loaderDiv.remove();
      musicPlayerh1.innerHTML = "";
      createHTMLMusicPlayer(musicPlayerDiv, musicPlayerh1);
    }, 50);
  }

  function createAudioElement(url) {
    const audio = new Audio();
    audio.preload = "none";
    audio.src = url;
    audio.controls = false;
    return audio;
  }

  // const addAudio = song =>{
  //   song.urlAudio = createAudioElement(song.url);
  //   song.creditAudio = createAudioElement(cong.credit);
  //   return song;
  // }

  const addAudioFromUrl = (song) => {
    song.audio = createAudioElement(song.url);
    return song;
  };

  const addAudioFromCredit = (song) => {
    // if (!song.credit) {
    //   console.log("song has no credit", song);
    // }
    song.audio = createAudioElement(song.url);
    return song;
  };

  const introTracks = [
    {
      // url: "./sounds/00_INTRO/INTRO2.mp3",
      name: "intro",
      url: "./sounds/CREDITS/fakeIntro.mp3",
      duration: 5,
      tags: ["intro"],
      credit: "",
    },
  ].map(addAudioFromUrl);

    let creditsArray = [];


  // let creditsArray = [
  //   {
  //     name: "hardcoded cred",
  //     url: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
  //     duration: 3,
  //     tags: ["credits"],
  //     credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
  //   },
  // ].map(addAudioFromCredit);

  const outroAudioSounds = [
    {
      name: "outro",
      url: "./sounds/XX_OUTRO/OUTRO2PT1SOLO.mp3",
      duration: 3,
      tags: ["outro"],
      credit: "",
    },
  ].map(addAudioFromUrl);

  const finalOutroAudioSounds = [
    {
      name: "outroBGMusic",
      url: "./sounds/XX_OUTRO/OUTRO2PT2SOLO.mp3",
      duration: 6,
      tags: ["outro"],
      credit: "",
    },
  ].map(addAudioFromUrl);

  const SONGS = [
    {
      name: "M_TURKWAZ_02",
      url: "./sounds/MUSIC/M_TURKWAZ_02.mp3",
      duration: 395,
      tags: ["Long, Middle, Verbal, Moderate, Sound, Home, Nature, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_TURKWAZ_03",
      url: "./sounds/MUSIC/M_TURKWAZ_03.mp3",
      duration: 319,
      tags: ["Long, Middle, Verbal, Heavy, Nature, Home, Wellness, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_TURKWAZ_01",
      url: "./sounds/MUSIC/M_TURKWAZ_01.mp3",
      duration: 384,
      tags: [
        "Long, Beginning, Middle, End, Verbal, Moderate, Sound, Home, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_TURKWAZ_04",
      url: "./sounds/MUSIC/M_TURKWAZ_04.mp3",
      duration: 111,
      tags: ["Medium, Middle, Verbal, Light, Sound, Nature, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_TURKWAZ_10",
      url: "./sounds/MUSIC/M_TURKWAZ_10.mp3",
      duration: 160,
      tags: ["Medium, Middle, Verbal, Moderate, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_DEMI_08",
      url: "./sounds/MUSIC/M_DEMI_08.mp3",
      duration: 75,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_TURKWAZ_05",
      url: "./sounds/MUSIC/M_TURKWAZ_05.mp3",
      duration: 247,
      tags: ["Long, Middle, Verbal, Light, Sound, Nature, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_KIKO_B_03",
      url: "./sounds/MUSIC/M_KIKO_B_03.mp3",
      duration: 113,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_KIKO_Z_02",
      url: "./sounds/MUSIC/M_KIKO_Z_02.mp3",
      duration: 158,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_KIKO_B_02",
      url: "./sounds/MUSIC/M_KIKO_B_02.mp3",
      duration: 148,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_KIKO_Z_01",
      url: "./sounds/MUSIC/M_KIKO_Z_01.mp3",
      duration: 77,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_KIKO_B_01",
      url: "./sounds/MUSIC/M_KIKO_B_01.mp3",
      duration: 162,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_KIKO_S_02",
      url: "./sounds/MUSIC/M_KIKO_S_02.mp3",
      duration: 63,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_DEMI_13",
      url: "./sounds/MUSIC/M_DEMI_13.mp3",
      duration: 102,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_DEMI_06",
      url: "./sounds/MUSIC/M_DEMI_06.mp3",
      duration: 111,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_CHARLOTTE_16",
      url: "./sounds/MUSIC/M_CHARLOTTE_16.mp3",
      duration: 68,
      tags: [
        "Medium, End, Middle, Verbal, Moderate, Wellness, Home, Nature, Wetland, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_CHARLOTTE_14",
      url: "./sounds/MUSIC/M_CHARLOTTE_14.mp3",
      duration: 76,
      tags: [
        "Medium, Middle, End, Verbal, Moderate, Wellness, Nature, Wetland",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_DEMI_11",
      url: "./sounds/MUSIC/M_DEMI_11.mp3",
      duration: 87,
      tags: [
        "Medium, Middle, Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_DEMI_05",
      url: "./sounds/MUSIC/M_DEMI_05.mp3",
      duration: 34,
      tags: [
        "Short, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_TURKWAZ_09",
      url: "./sounds/MUSIC/M_TURKWAZ_09.mp3",
      duration: 241,
      tags: ["Long, Middle, Verbal, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/TURKWAZ.mp3",
    },
    {
      name: "M_CHARLOTTE_15",
      url: "./sounds/MUSIC/M_CHARLOTTE_15.mp3",
      duration: 60,
      tags: ["Short, End, Verbal, Moderate, Home, Nature, Wetland"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_CHARLOTTE_11",
      url: "./sounds/MUSIC/M_CHARLOTTE_11.mp3",
      duration: 94,
      tags: [
        "Short, Middle, End, Verbal, Moderate, Sound, Home, Listening, Wetland",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_KIKO_C_06",
      url: "./sounds/MUSIC/M_KIKO_C_06.mp3",
      duration: 79,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "M_CHARLOTTE_10",
      url: "./sounds/MUSIC/M_CHARLOTTE_10.mp3",
      duration: 130,
      tags: [
        "Medium, Middle, End, Verbal, Moderate, Home, Wellness, Nature, Wetland",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_CHARLOTTE_12",
      url: "./sounds/MUSIC/M_CHARLOTTE_12.mp3",
      duration: 141,
      tags: ["Medium, Middle, End, Verbal, Moderate, Home, Ancestors, Wetland"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_DEMI_02",
      url: "./sounds/MUSIC/M_DEMI_02.mp3",
      duration: 45,
      tags: [
        "Short, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_DEMI_03",
      url: "./sounds/MUSIC/M_DEMI_03.mp3",
      duration: 42,
      tags: [
        "Short, Middle, Non-Verbal, Moderate, Sound, Home, Vibration, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_CHARLOTTE_13",
      url: "./sounds/MUSIC/M_CHARLOTTE_13.mp3",
      duration: 146,
      tags: ["Medium, Middle, End, Verbal, Moderate, Wellness, Wetland"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "M_KIKO_C_05",
      url: "./sounds/MUSIC/M_KIKO_C_05.mp3",
      duration: 61,
      tags: [
        "Medium, Middle, Non-Verbal, Moderate, Sound, Wellness, Vibration, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "P_ALBERT_15",
      url: "./sounds/POETRY/P_ALBERT_15.mp3",
      duration: 110,
      tags: ["Medium, Middle, Verbal, Light, Moderate, Nature, Trees"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_01",
      url: "./sounds/POETRY/P_ALBERT_01.mp3",
      duration: 57,
      tags: ["Short, Middle, Verbal, Heavy, Nature, Home, Trees, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_14",
      url: "./sounds/POETRY/P_ALBERT_14.mp3",
      duration: 127,
      tags: ["Medium, Middle, Verbal, Heavy, Nature, Home, Trees, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_02",
      url: "./sounds/POETRY/P_ALBERT_02.mp3",
      duration: 268,
      tags: [
        "Long, Middle, Verbal, Heavy, Nature, Wellness, Home, Ancestors, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_16",
      url: "./sounds/POETRY/P_ALBERT_16.mp3",
      duration: 27,
      tags: [
        "Short, Beg, Middle, End, Verbal, Moderate, Wellness, Nature, Trees",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_17",
      url: "./sounds/POETRY/P_ALBERT_17.mp3",
      duration: 62,
      tags: [
        "Medium, Beg, Mid, End, Verbal, Light, Moderate, Nature, Home, Sound, Trees, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_03",
      url: "./sounds/POETRY/P_ALBERT_03.mp3",
      duration: 41,
      tags: [
        "Short, Beginning, Middle, End, Verbal , Moderate, Wellness, Sound, Home, Ancestors",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_07",
      url: "./sounds/POETRY/P_ALBERT_07.mp3",
      duration: 36,
      tags: [
        "Short, Middle, Verbal, Heavy, Nature, Home, Wellness, Sound, Unselfing, Ancestors, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_13",
      url: "./sounds/POETRY/P_ALBERT_13.mp3",
      duration: 73,
      tags: [
        "Medium, Middle, Verbal, Moderate, Nature, Wellness, Trees, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_12",
      url: "./sounds/POETRY/P_ALBERT_12.mp3",
      duration: 48,
      tags: ["Short, Beg, Middle, Verbal, Moderate, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_06",
      url: "./sounds/POETRY/P_ALBERT_06.mp3",
      duration: 45,
      tags: [
        "Short, Beg, End, Verbal, Heavy, Sound, Home, Wellness, Ancestors, Vibration",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_10",
      url: "./sounds/POETRY/P_ALBERT_10.mp3",
      duration: 23,
      tags: ["Short, Middle, Verbal, Heavy, Home, Sound, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_04",
      url: "./sounds/POETRY/P_ALBERT_04.mp3",
      duration: 53,
      tags: [
        "Short, Middle, Verbal , Heavy, Wellness, Home, Nature, Sound, Ancestors, Trees, Unselfing, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_05",
      url: "./sounds/POETRY/P_ALBERT_05.mp3",
      duration: 38,
      tags: ["Short, Middle, Verbal , Heavy, Nature, Home, Trees, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_11",
      url: "./sounds/POETRY/P_ALBERT_11.mp3",
      duration: 89,
      tags: [
        "Medium, Middle, End, Verbal, Moderate, Home, Sound, Wellness, Ancestors, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_ALBERT_08",
      url: "./sounds/POETRY/P_ALBERT_08.mp3",
      duration: 49,
      tags: ["Short, Middle, Verbal, Moderate, Nature, Wellness, Trees"],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_NAMITHA_03",
      url: "./sounds/POETRY/P_NAMITHA_03.mp3",
      duration: 30,
      tags: ["Short, Middle, Verbal, Heavy, Nature, Wellness, "],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_NAMITHA_02",
      url: "./sounds/POETRY/P_NAMITHA_02.mp3",
      duration: 55,
      tags: ["Short, Middle, Verbal, Moderate, Nature, Home, Sound, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_ALBERT_09",
      url: "./sounds/POETRY/P_ALBERT_09.mp3",
      duration: 36,
      tags: ["Short, Middle, End, Verbal, Heavy, Nature, Wellness, "],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "P_NAMITHA_01",
      url: "./sounds/POETRY/P_NAMITHA_01.mp3",
      duration: 47,
      tags: ["Short, Middle, Verbal, Light, Moderate, Nature, "],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_NAMITHA_05",
      url: "./sounds/POETRY/P_NAMITHA_05.mp3",
      duration: 29,
      tags: ["Short, Beg, Middle, Verbal, Heavy, Home, Nature, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_NAMITHA_04",
      url: "./sounds/POETRY/P_NAMITHA_04.mp3",
      duration: 26,
      tags: ["Short, Middle, Verbal, Heavy, Nature, Trees, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_NAMITHA_06",
      url: "./sounds/POETRY/P_NAMITHA_06.mp3",
      duration: 11,
      tags: ["Short, Middle, Verbal, Moderate, Nature, Wellness, Sound, "],
      credit: "./sounds/XX_OUTRO/NAMES/NAMITHA.mp3",
    },
    {
      name: "P_ALBERT_18",
      url: "./sounds/POETRY/P_ALBERT_18.mp3",
      duration: 64,
      tags: ["Medium, Middle, End, Verbal, Moderate, Nature, Wellness, Home, "],
      credit: "./sounds/XX_OUTRO/NAMES/ALBERT.mp3",
    },
    {
      name: "S_KIKO_S_04",
      url: "./sounds/SHORTS/S_KIKO_S_04.mp3",
      duration: 36,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_KIKO_S_03",
      url: "./sounds/SHORTS/S_KIKO_S_03.mp3",
      duration: 36,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_KIKO_S_02",
      url: "./sounds/SHORTS/S_KIKO_S_02.mp3",
      duration: 28,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_BIRDS_17",
      url: "./sounds/SHORTS/S_BIRDS_17.mp3",
      duration: 64,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_03",
      url: "./sounds/SHORTS/S_BIRDS_03.mp3",
      duration: 71,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_16",
      url: "./sounds/SHORTS/S_DEMI_16.mp3",
      duration: 22,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_KIKO_C_01",
      url: "./sounds/SHORTS/S_KIKO_C_01.mp3",
      duration: 54,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_DEMI_17",
      url: "./sounds/SHORTS/S_DEMI_17.mp3",
      duration: 11,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_CHARLOTTE_09",
      url: "./sounds/SHORTS/S_CHARLOTTE_09.mp3",
      duration: 22,
      tags: ["Short, Middle, Verbal, Light, Nature, Wetlands"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_02",
      url: "./sounds/SHORTS/S_BIRDS_02.mp3",
      duration: 84,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_16",
      url: "./sounds/SHORTS/S_BIRDS_16.mp3",
      duration: 32,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_14",
      url: "./sounds/SHORTS/S_BIRDS_14.mp3",
      duration: 73,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_15",
      url: "./sounds/SHORTS/S_DEMI_15.mp3",
      duration: 10,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_KIKO_C_02",
      url: "./sounds/SHORTS/S_KIKO_C_02.mp3",
      duration: 37,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_DEMI_14",
      url: "./sounds/SHORTS/S_DEMI_14.mp3",
      duration: 14,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_15",
      url: "./sounds/SHORTS/S_BIRDS_15.mp3",
      duration: 35,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_01",
      url: "./sounds/SHORTS/S_BIRDS_01.mp3",
      duration: 96,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_05",
      url: "./sounds/SHORTS/S_BIRDS_05.mp3",
      duration: 66,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_11",
      url: "./sounds/SHORTS/S_BIRDS_11.mp3",
      duration: 41,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_10",
      url: "./sounds/SHORTS/S_BIRDS_10.mp3",
      duration: 65,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_04",
      url: "./sounds/SHORTS/S_BIRDS_04.mp3",
      duration: 60,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_12",
      url: "./sounds/SHORTS/S_BIRDS_12.mp3",
      duration: 31,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_06",
      url: "./sounds/SHORTS/S_BIRDS_06.mp3",
      duration: 88,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_07",
      url: "./sounds/SHORTS/S_BIRDS_07.mp3",
      duration: 92,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_13",
      url: "./sounds/SHORTS/S_BIRDS_13.mp3",
      duration: 56,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_23",
      url: "./sounds/SHORTS/S_DEMI_23.mp3",
      duration: 21,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_CHARLOTTE_01",
      url: "./sounds/SHORTS/S_CHARLOTTE_01.mp3",
      duration: 74,
      tags: [
        "Medium, End, Verbal, Moderate, Nature, Wellness, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_KIKO_C_09",
      url: "./sounds/SHORTS/S_KIKO_C_09.mp3",
      duration: 41,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "S_DEMI_22",
      url: "./sounds/SHORTS/S_DEMI_22.mp3",
      duration: 22,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_LAUGHING_01",
      url: "./sounds/SHORTS/S_LAUGHING_01.mp3",
      duration: 15,
      tags: ["Short, Middle, Non-Verbal, Light, Sound, Wellness, "],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_09",
      url: "./sounds/SHORTS/S_BIRDS_09.mp3",
      duration: 46,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_20",
      url: "./sounds/SHORTS/S_DEMI_20.mp3",
      duration: 22,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_CHARLOTTE_02",
      url: "./sounds/SHORTS/S_CHARLOTTE_02.mp3",
      duration: 25,
      tags: ["Short, Beginning, Middle, Verbal, Light, Nature, Wetlands"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_CHARLOTTE_03",
      url: "./sounds/SHORTS/S_CHARLOTTE_03.mp3",
      duration: 31,
      tags: ["Short, Middle, Verbal, Light, Nature, Wetlands"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_21",
      url: "./sounds/SHORTS/S_DEMI_21.mp3",
      duration: 10,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_LAUGHING_02",
      url: "./sounds/SHORTS/S_LAUGHING_02.mp3",
      duration: 28,
      tags: ["Short, Middle, Non-Verbal, Light, Sound, Wellness, "],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_08",
      url: "./sounds/SHORTS/S_BIRDS_08.mp3",
      duration: 57,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_BIRDS_18",
      url: "./sounds/SHORTS/S_BIRDS_18.mp3",
      duration: 63,
      tags: [
        "Short, Middle, Non-Human, Light, Nature, Sound, Wetlands, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_CHARLOTTE_07",
      url: "./sounds/SHORTS/S_CHARLOTTE_07.mp3",
      duration: 41,
      tags: ["Short, Middle, Verbal, Light, Nature, Wetlands"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_19",
      url: "./sounds/SHORTS/S_DEMI_19.mp3",
      duration: 15,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_DEMI_18",
      url: "./sounds/SHORTS/S_DEMI_18.mp3",
      duration: 21,
      tags: ["Short, Middle, End, Music, Light, Sound, Home, Ancestors"],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "S_KIKO_B_04",
      url: "./sounds/SHORTS/S_KIKO_B_04.mp3",
      duration: 21,
      tags: ["Short, Middle, Music, Moderate, Sound, Wellness, Vibration"],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "I_JAYNE_02",
      url: "./sounds/INTERVIEWS/I_JAYNE_02.mp3",
      duration: 79,
      tags: [
        "Interview, Medium, Middle, Verbal, Light, Nature, Informative, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "I_JAYNE_03",
      url: "./sounds/INTERVIEWS/I_JAYNE_03.mp3",
      duration: 149,
      tags: [
        "Interview, Medium, Middle, Verbal, Light, Nature, Sound, Informative, Vibration, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "I_JAYNE_01",
      url: "./sounds/INTERVIEWS/I_JAYNE_01.mp3",
      duration: 226,
      tags: [
        "Interview, Long, Middle, Verbal, Light, Nature, Sound, Informative, Vibration",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/CHARLOTTE.mp3",
    },
    {
      name: "I_LOUELLA_02",
      url: "./sounds/INTERVIEWS/I_LOUELLA_02.mp3",
      duration: 140,
      tags: [
        "Interview, Medium, Middle, Verbal, Moderate, Nature, Home, Wellness , Unselfing, Ancestors, Wetland",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/LOUELLA.mp3",
    },
    {
      name: "I_ELLEN_02_TempMusic",
      url: "./sounds/INTERVIEWS/I_ELLEN_02_TempMusic.mp3",
      duration: 133,
      tags: ["interviews"],
      credit: "./sounds/XX_OUTRO/NAMES/ELLEN.mp3",
    },
    {
      name: "I_LOUELLA_03",
      url: "./sounds/INTERVIEWS/I_LOUELLA_03.mp3",
      duration: 198,
      tags: [
        "Interview, Long, Middle, Verbal, Moderate, Wellness, Nature, Informative, Trees, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/LOUELLA.mp3",
    },
    {
      name: "I_LOUELLA_01",
      url: "./sounds/INTERVIEWS/I_LOUELLA_01.mp3",
      duration: 237,
      tags: [
        "Interview, Long, Middle, Verbal, Moderate, Sound, Wellness, Informative, Nature, Trees",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/LOUELLA.mp3",
    },
    {
      name: "I_KIKO_02",
      url: "./sounds/INTERVIEWS/I_KIKO_02.mp3",
      duration: 247,
      tags: [
        "Interview, Long, End, Verbal, Heavy, Sound, Wellness, Listening, Vibration, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "I_KIKO_03",
      url: "./sounds/INTERVIEWS/I_KIKO_03.mp3",
      duration: 174,
      tags: [
        "Interview, Long, Middle, Verbal, Moderate, Sound, Wellness, Listening, Vibration, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "I_KIKO_01",
      url: "./sounds/INTERVIEWS/I_KIKO_01.mp3",
      duration: 233,
      tags: [
        "Interview, Long, Middle, Verbal, Moderate, Sound, Wellness, Listening, Vibration, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/KIKO.mp3",
    },
    {
      name: "I_ELLEN_01_TempMusic",
      url: "./sounds/INTERVIEWS/I_ELLEN_01_TempMusic.mp3",
      duration: 172,
      tags: ["interviews"],
      credit: "./sounds/XX_OUTRO/NAMES/ELLEN.mp3",
    },
    {
      name: "I_JESSE_01",
      url: "./sounds/INTERVIEWS/I_JESSE_01.mp3",
      duration: 229,
      tags: [
        "Interview, Long, End, Middle, Verbal, Heavy, Sound, Nature, Wellness, Informative, Wetlands, Listening, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/JESSE.mp3",
    },
    {
      name: "I_ELLEN_03",
      url: "./sounds/INTERVIEWS/I_ELLEN_03.mp3",
      duration: 244,
      tags: [
        "Interview, Long, Middle, Verbal, Moderate, Home, Sound, Informative, Unselfing",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ELLEN.mp3",
    },
    {
      name: "I_SAM_01",
      url: "./sounds/INTERVIEWS/I_SAM_01.mp3",
      duration: 137,
      tags: [
        "Interview, Medium, Middle, Verbal, Light, Nature, Informative, Wetlands",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/SAM.mp3",
    },
    {
      name: "I_ELLEN_04",
      url: "./sounds/INTERVIEWS/I_ELLEN_04.mp3",
      duration: 154,
      tags: [
        "Interview, Medium, Beginning, Middle, End, Verbal, Light, Sound, Nature, Listening",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ELLEN.mp3",
    },
    {
      name: "I_ELLEN_05",
      url: "./sounds/INTERVIEWS/I_ELLEN_05.mp3",
      duration: 151,
      tags: [
        "Interview, Medium, Beginning, Middle, Verbal, Light, Sound, Wellness, Vibration",
      ],
      credit: "./sounds/XX_OUTRO/NAMES/ELLEN.mp3",
    },
  ].map(addAudioFromUrl);

  // amount of time selected for the walk in seconds
  // let total_duration = parseInt(
  //   document.getElementById("total-duration").value
  // );
  var total_duration = 1080;

  // how many seconds before a song is completed that we should pre-fetch the next song
  const PREFETCH_BUFFER_SECONDS = 8;

  // shuffle an array https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  // function shuffleElementsInAnArray(a) {
  //   for (let i = a.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [a[i], a[j]] = [a[j], a[i]];
  //   }
  //   return a;
  // }

//  shuffle algo
//  shuffle algo
//  shuffle algo  
function shuffleTracklist(tracklist) {
  // Shuffle the tracklist randomly
  function shuffleElementsInAnArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  tracklist = shuffleElementsInAnArray(tracklist);
  
  // Filter objects with "long" tag and add them to the end of the list
  const longObjects = tracklist.filter(obj => obj.tags.includes("long"));
  const otherObjects = tracklist.filter(obj => !obj.tags.includes("long"));
  tracklist = [...otherObjects, ...longObjects];
  
  // Find an object with "beginning" tag and move it to the first or second place
  const beginningObjectIndex = tracklist.findIndex(obj => obj.tags.includes("beginning"));
  if (beginningObjectIndex >= 2) {
    const beginningObject = tracklist.splice(beginningObjectIndex, 1)[0];
    tracklist.splice(Math.floor(Math.random() * 2), 0, beginningObject);
  }
  
  // Find an object with "end" tag and move it to 6 deep items in the list
  const endObjectIndex = tracklist.findIndex(obj => obj.tags.includes("end"));
  if (endObjectIndex >= 0 && endObjectIndex < tracklist.length - 6) {
    const endObject = tracklist.splice(endObjectIndex, 1)[0];
    tracklist.splice(endObjectIndex + 6, 0, endObject);
  }
  
  // Check and adjust for "Louella" and "heavy" tags
  for (let i = 0; i < tracklist.length - 1; i++) {
    const currentObject = tracklist[i];
    const nextObject = tracklist[i+1];
    
    if (currentObject.tags.includes("Louella") && nextObject.tags.includes("Louella")) {
      // Find an object without "Louella" tag and swap it with the next object
      const targetIndex = tracklist.findIndex((obj, index) => !obj.tags.includes("Louella") && index > i);
      if (targetIndex >= 0) {
        [tracklist[i+1], tracklist[targetIndex]] = [tracklist[targetIndex], tracklist[i+1]];
      }
    }
    
    if (currentObject.tags.includes("heavy") && nextObject.tags.includes("laughing")) {
      // Find an object without "laughing" tag and swap it with the next object
      const targetIndex = tracklist.findIndex((obj, index) => !obj.tags.includes("laughing") && index > i);
      if (targetIndex >= 0) {
        [tracklist[i+1], tracklist[targetIndex]] = [tracklist[targetIndex], tracklist[i+1]];
      }
    }
  }
  
  return tracklist;
}

  // Add more forbidden tag combinations as needed
  // Add more forbidden tag combinations as needed
  // Add more forbidden tag combinations as needed
const forbiddenTagCombinations = [
  { firstTag: "drone", secondTag: "drone" },
  { firstTag: "interviews", secondTag: "interviews" },
  { firstTag: "shorts", secondTag: "shorts" },
  { firstTag: "music", secondTag: "music" },
  { firstTag: "longmusic", secondTag: "longmusic" },
  // Add more forbidden tag combinations as needed
];


  // fetch and cache audio
  // fetch and cache audio
  // fetch and cache audio
  function fetchAndCacheAudio(audioFileUrl, cache) {
    // Check first if audio is in the cache.
    return cache.match(audioFileUrl).then((cacheResponse) => {
      // Let's return cached response if audio is already in the cache.
      if (cacheResponse) {
        return cacheResponse;
      }
      // Otherwise, fetch the audio from the network.
      return fetch(audioFileUrl).then((networkResponse) => {
        // Add the response to the cache and return network response in parallel.
        cache.put(audioFileUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  }

  

  // Set up event listener for when the outro audio ends
  // outroAudio1.addEventListener("ended", () => {

  let LastSeenTags = []; // store the tags of the last track, so we can make rules
  // const currentTrackUrlElement = document.getElementById("currTrack");

  // This recursive function processes each audio file at a time and then queues up
  // work for the next audio file to be processed.

  function playAndQueue(songs, index, currentRuntime, cache) {
    // if we're out of tracks or out of time, stop everything (should fade out eventually)
    if (index == songs.length || total_duration - currentRuntime < 0) {
      return;
    }

    // If we are near the end of the playlist, play the final three tracks.
    // 
    if (total_duration - currentRuntime <= 90) {
      // console.log("near the end");
      function skipToEndOfThePlaylistFunction(songs, currentIndex, newIndex) {
        if (!hasSkippedToEnd) {
          console.log("Skipping for the first time!");
          const numElementsToEnd = songs.length - currentIndex - 1;
          index = index + numElementsToEnd;
          let newIndex = index;

          songs.push(...outroAudioSounds);
          // songs.push(...creditsArray);

          creditsArray.forEach((credit) => songs.push(credit));
          
          // console.log("after adding creditsArray", songs.length);
          // console.log(songs);

          // songs.push(...creditsArray);
          songs.push(...finalOutroAudioSounds);
          hasSkippedToEnd = true;
        } else {
          // console.log("Action already performed, skipping...");
        }
      }
      skipToEndOfThePlaylistFunction(songs, index);
    }

    // get the song object
    const song = songs[index];

    if (song) {
      const currTagsHTMLElement = document.getElementById("currTags");
      const currURLHTMLElement = document.getElementById("currTrack");
      const currDurrHTMLElement = document.getElementById("currDurr");
      const currTrackNameHTMLElement = document.getElementById("currTrackName");
      const currCreditStackHTMLElement =
        document.getElementById("creditsStack");
      const currIndexNokHTMLElement = document.getElementById("indexNo");
      const currTotalIndexHTMLElement = document.getElementById("totalIndex");

      const currTags = song.tags;
      const currUrl = song.url;
      const currDurr = song.duration;
      const currName = song.name;
      const currCredit = song.credit;
      const currIndex = index;

      // don't play long tracks
      console.log(currDurr);
      if (currDurr > 70) {
        console.log("forbidden!");
        playAndQueue(songs, index + 1, currentRuntime, cache);
        return;
      }


      if (currTags && currTags != "") {
        currTagsHTMLElement.textContent = " " + currTags;
      } else {
        console.log("no tags");
      }

      // need to make sure this still works - esp w mult tags
      if (LastSeenTags.length > 0) {
        const forbiddenCombination = forbiddenTagCombinations.find(
          (combination) =>
            combination.firstTag === LastSeenTags[0] &&
            combination.secondTag === currTags[0]
        );
        if (forbiddenCombination) {
          console.log("forbidden!");
          playAndQueue(songs, index + 1, currentRuntime, cache);
          return;
        }
      }
      LastSeenTags = currTags;

      if (currUrl && currUrl != "") {
        currURLHTMLElement.textContent = " " + currUrl;
      } else {
        console.log("no url");
      }

      if (currDurr && currDurr != "") {
        currDurrHTMLElement.textContent = " " + currDurr;
      } else {
        console.log("no dur");
      }

      if (currIndex) {
        currIndexNokHTMLElement.textContent = " " + currIndex;
      } else {
        console.log("no index");
      }

      if (songs) {
        currTotalIndexHTMLElement.textContent = " " + songs.length;
      } else {
        console.log("no index");
      }

      if (currName && currName != "") {
        currTrackNameHTMLElement.textContent = " " + currName;
      } else {
        console.log("no name");
      }

      if (currCredit && currCredit !== "") {
        console.log(song);

        // creditsArray.push(song);

        const createCreditObj = function(song) {
          const creditObj = {
            name: song.name,
            url: song.credit, //flip on purpose
            duration: song.duration,
            tags: song.tags,
            credit: song.url,
          };
          return creditObj;
        };
        
        const creditObj = createCreditObj(song);
        creditsArray.push(addAudioFromCredit(creditObj));
        console.log(creditsArray);
        console.log(songs);

        creditsArray.forEach((credit) => {
        // console.log(`credits ${JSON.stringify(credit)}`);
        });
        // extract credits from the array of objects and join them with newlines
        const mycredits = creditsArray.map((song) => song.credit);
        const creditsText = mycredits
          .map((credit) => credit.substring(credit.lastIndexOf("/") + 1))
          .join("\n" +"\n" +"\n" );
        // currCreditStackHTMLElement.textContent = creditsText;
      } else {
        console.log("no credit");
      }
    } else {
      console.log("NO SONG!!!");
      return;
    }

    const audio = song.audio;
    // Update player to current audio
    player = audio;
    // hopefully tell the browser to start downloading audio
    if (audio) {
      audio.preload = "auto";
    }

    const track = audioContext.createMediaElementSource(audio);
    track.connect(gainNode);

    // when the song has ended, queue up the next one
    audio.addEventListener("ended", (e) => {
      const duration = audio.duration;
      playAndQueue(songs, index + 1, currentRuntime + duration, cache);
    });

    // When metadata has been loaded, we know the
    // audio duration. With the audio duration, we
    // do two things depending on where we are in the
    // play queue:
    //
    // 1. If the currentRuntime is greater than the total
    //    duration, then we set a timeout to pause the song.
    // 2. else, if there is a next song, we set a timeout
    //    that will try and preload the song.
    audio.addEventListener("loadedmetadata", (e) => {
      const duration = audio.duration;
      const durationInMin = Math.floor(duration / 60);
      const remainingSec = Math.round(duration % 60);
      const formattedMin =
        durationInMin < 10 ? `0${durationInMin}` : durationInMin;
      const formattedSec =
        remainingSec < 10 ? `0${remainingSec}` : remainingSec;
      const formattedDuration = `${formattedMin}:${formattedSec}`;

      if (currentRuntime + duration > total_duration) {
        const remainingMs = (total_duration - currentRuntime) * 1000;
        setTimeout(() => {
          audioContext.suspend();
          clearInterval(timerInterval);
        }, remainingMs);
      } else if (index < songs.length - 1) {
        // set a timer to preload the next file
        const timeoutDurationMs = (duration - PREFETCH_BUFFER_SECONDS) * 1000;
        setTimeout(() => {
          const nextAudio = songs[index + 1];
          nextAudio.preload = "auto";
          fetchAndCacheAudio(nextAudio.url, cache).then(
            (p) => console.log(`loaded ${nextAudio.url} into cache`)
            // document.getElementById("nextUp").innerHTML = nextAudio.url;
          );
        }, timeoutDurationMs);
      }
    });
    console.log(audio);
    audio.play();
  }

  const button = document.getElementById("play");

  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
  button.addEventListener("click", (event) => {
    displayLoadingGif();

    if (audioContext == null) {
      // for browser compatibility, redefine AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
    }

    // shuffle the songs around so they play in a random order - first we copy the array
    const shuffledSongs = [...SONGS];

    // next we shuffle it
    // shuffleElementsInAnArray(shuffledSongs);
    shuffleTracklist(shuffledSongs);

    // next we add the intro to the beginning
    const shuffledSongsWithOpen = [...introTracks, ...shuffledSongs];

    // now we will print all the shuffled songs for the debug
    const currTrackNameElement = document.getElementById("fullList");
    while (currTrackNameElement.firstChild) {
      currTrackNameElement.removeChild(currTrackNameElement.firstChild);
    }

    for (let i = 0; i < shuffledSongsWithOpen.length; i++) {
      const itemElement = document.createElement("div");
      itemElement.textContent = shuffledSongsWithOpen[i].name;
      currTrackNameElement.appendChild(itemElement);
    }

    if (shuffledSongsWithOpen.length > 0) {
      currTrackNameElement.style.display = "block";
    } else {
      // console.log("no shuffle");
    }

    window.caches
      .open("audio-pre-cache")
      .then((cache) => playAndQueue(shuffledSongsWithOpen, 0, 0, cache));
  });

  const totalDurationInput = document.getElementById("total-duration");
  let totalDuration = total_duration / 60; // use a separate variable to store the value in minutes
  if (totalDurationInput) {
    totalDurationInput.value = totalDuration;
    totalDurationInput.addEventListener("input", (event) => {
      totalDuration = parseInt(event.target.value);
      total_duration = totalDuration * 60; // update the global variable in seconds
    });
  }
  function updateProgress(seconds, previousDuration) {
    let currTime = document.getElementById("current-time");
    if (!currTime) {
      throw new Error("Missing element: current-time");
    }
    timerDuration = seconds + previousDuration;
    if (currTime == null) {
      //do nothing. there is a delay whe the player is made.
    } else {
      let remaining = total_duration - (seconds + previousDuration);
      let minutes = Math.floor(remaining / 60);
      if (remaining <= 0) {
        currTime.innerHTML = "done";
      } else {
        let remainingSeconds = (remaining % 60).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        currTime.innerHTML = `${minutes}:${remainingSeconds}`;
      }
    }
  }

  function createTimerLoop(previousDuration) {
    var start = Date.now();
    return setInterval(() => {
      let delta = Date.now() - start; // milliseconds since elapsed
      let deltaSeconds = Math.floor(delta / 1000);
      updateProgress(deltaSeconds, previousDuration);
    }, 200);
  }
});
