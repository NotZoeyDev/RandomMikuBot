/*
    The whole script is here
    Made by Zoey with love for Miki 💜
*/

// Required modules
const Twitter = require('twit'), TwitterApiKeys = require('./keys.json'), fs = require('fs'), path = require('path');

// Folder with the picture of Miku~
const MikuFolder = "S:\\Images\\Vocaloid\\Miku";

// Usual message
const DefaultMessage = "Hey @PokegirlMiki, here's a cute Miku for you!";

// Cute messages
const CuteMessages = [
    "Hope it'll bring you a smile",
    "Hope it'll cheer you up",
    "Hope it'll make your day better",
    "Hope you'll like it",
    "Almost as cute as you",
    "You look beautiful",
    "Your Luka misses you"
];

// Morning messages
const MorningMessages = [
    "Hope you have a nice day",
    "Hope work won't be too boring",
    "Hope you've slept well",
    "Hope you've had nice dreams",
    "Hope the sun is shining bright for you"
];

// Night messages
const NightsMessages = [
    "Sleep well",
    "Have sweet dreams",
    "Have some comfy sleep",
    "Have a good night",
    "Get some sleep silly girl"
];

// Return a random number
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Scan the folder and get a random image
function postPicture(dayMoment) {
    // Get the folder files
    const files = fs.readdirSync(MikuFolder);
    
    // File that will be uploaded
    const selectedFile = path.normalize(MikuFolder + "/" + files[getRandomNumber(files.length)]);

    // Convert the selected file into Base64
    const selectedFileBase64 = fs.readFileSync(selectedFile, {encoding: "base64"});

    // Create Twitter access
    const TwitterAccess = new Twitter(TwitterApiKeys);

    // Upload the picture to Twitter
    TwitterAccess.post('media/upload', {media_data: selectedFileBase64}, (err, data, response) => {
        // The imageID on Twitter's server
        const imageID = data.media_id_string;

        // Text used for screen-readers on Twitter
        const alternativeText = "A cute picture of Hatsune Miku.";

        // Params for the image
        const metaParams = {
            media_id: imageID,
            alt_text: {
                text: alternativeText
            }
        };

        // Add the metadata to the picture
        TwitterAccess.post('media/metadata/create', metaParams, (err, data, response) => {
            // Params for the tweet  
            const tweetParams = {
                media_ids: [imageID]
            };

            // Check if we need to get a special or normal message
            switch(dayMoment) {
                case "Morning":
                    tweetParams.status = `${DefaultMessage} ${MorningMessages[getRandomNumber(MorningMessages.length)]}~!`;
                    break;

                case "Night":
                    tweetParams.status = `${DefaultMessage} ${MightMessages[getRandomNumber(MightMessages.length)]}~!`;
                    break;

                case null:
                default:
                    tweetParams.status = `${DefaultMessage} ${CuteMessages[getRandomNumber(CuteMessages.length)]}~!`;
                    break;
            }

            // Upload the tweet!
            TwitterAccess.post('statuses/update', tweetParams, (err, data, response) => {
                console.log("Tweet sent!");
            });
        });
    });
}

// Loop that handles posting the pictures
function postingLoop() {
    // Get current time
    const rightNow = new Date();

    // Get the current hour and minute
    const currentHour = parseInt(rightNow.getHours()), currentMinute = parseInt(rightNow.getMinutes());

    // Make sure we're between 12:00 and 20::
    if(currentHour >= 12 && currentHour <= 20) {
        // Begining of a new hour, post a Miku~
        if(currentMinute <= 0) {
            // Variable used to check if it's the morning or the night for special case messages~
            const currentMoment = currentHour == 12 ? "Morning" : currentHour == 20 ? "Night" : null;

            // Post the Miku~
            postPicture(currentMoment);
        }
    }
}

// Run the loop every minute
setInterval(postingLoop, 1000*60);

