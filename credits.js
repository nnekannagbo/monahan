// import { prepareSongForPlayback } from './play.js';














//  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //  XXXXXXXXXXX CREDITS STUFF XXXXXXXXXXXXX
  //  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  let arrayOfCreditSongs = [];
  let creditsLog = [];

  function addToCreditsLog(songCredit) {
    const strippedCredit = songCredit.substring(songCredit.lastIndexOf("_") + 1);
    creditsLog.push(`${strippedCredit}<br>`);
  }

  function createCreditObjectAndAddToArray(song) {
    const creditObj = {
      name: song.name,
      url: song.credit, // flip on purpose
      duration: "2",
      author: song.author,
      // Other properties as before
      credit: song.url,
    };
    // Directly push the credit object without creating an audio element
    arrayOfCreditSongs.push(creditObj);
  }

  function trackExistsWithAttributes(curatedTracklist, attribute, value) {
    for (const track of curatedTracklist) {
      if (typeof track === "object" && track.hasOwnProperty(attribute)) {
        // Check if track[attribute] is an array
        if (Array.isArray(track[attribute])) {
          // Check if any element in track[attribute] matches any element in value
          if (track[attribute].some((item) => value.includes(item))) {
            return track; // Return the first matching track
          }
        } else if (track[attribute] === value) {
          return track; // Return the first matching track
        }
      }
    }
    return null; // Return null if no matching track is found
  }

  function playCreditSong(creditSong) {
    if (!globalAudioElement) {
      console.log("Global audio element is not initialized.");
      return;
    }
  
    globalAudioElement.src = creditSong.url; // Use the credit song's URL for playback
    globalAudioElement.play().catch(error => {
      console.error("Playback failed", error);
    });
  }

  export function gatherTheCreditSongs(curatedTracklist) {
    for (let index = 0; index < curatedTracklist.length; index++) {
      const song = curatedTracklist[index];

      const songTitles = arrayOfCreditSongs.map((song) => song.credit).join(", ");

      if (song.credit == "") {
        // No credit information, do nothing
      } else {
        const matchingCreditSong = trackExistsWithAttributes(arrayOfCreditSongs, "url", song.credit);

        if (matchingCreditSong) {
          // Matching credit song found, do nothing
        } else {
          addToCreditsLog(song.credit);
          createCreditObjectAndAddToArray(song);
          // Credit being added
        }
      }

      // curatedTracklistTotalTimeInSecs = calculateOrUpdatecuratedTracklistDuration(song, curatedTracklist);
      // console.log(`adding credit, gopefully song is ${song}, hopefully song duration is ${song.duration}`);
    }
    return arrayOfCreditSongs;
  }