# Igigi

Igigi is a gig helper for the working musician. You can install your gigs, setlists, lyrics and even play audio via the sampler pads.

When the performance starts, you can follow Igigi to see your set map and lyrics on one single screen.

![Screenshot](screenshot.png?raw=true "Screenshot")

# Installation

Igigi was written with JavaScript on React Native, so it will theoretically run on any mobile device.

It has the standard React Native prerequisites; such as npm, expo, etc.

After cloning the repository, edit assets/igigi_sample.json to put your own data. Then, on the command prompt, go to your Igigi folder and type:

```
expo eject igigi
```

This will create two folderes: ios and android. Depending on the device you want to use, you can continue with XCode or Android Studio to install the app to your device.

# Dropbox preparation

To use this application, you need to transfer your JSON & audio files over DropBox.

## Step 1: Connect to Dropbox

Start the application and open the DropBox tab. Once you get your code, a new folder will be created on your computer as Dropbox/apps/igigi . That's where you need to put your files.

## Step 2: Create igigi.json

Go to the prementioned folder and create your igigi.json file. The file should look like the file provided here under /assets/igigi_sample.json. 

The only significant difference is; audio files should point to real URL's (not relative Dropbox file names). If you need to put a Dropbox file here, make it public and paste its link as demonstrated below:

```
(...)
"samples": [
        {"name": "Chime", "file": "https://www.dropbox.com/s/4o4lhjfhao4hmjq/sample_chime.mp3?dl=1"},
        {"name": "UFO", "file": "https://www.dropbox.com/s/s6t6a1y909658v8/sample_ufo.mp3?dl=1"}
    ],
(...)
```