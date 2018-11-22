# playvienna-web

TODO Update (only build-related info)

## Building

Download and install Node.js from http://nodejs.org/

Navigate into the `playvienna.com/` directory and install all required packages with:

    npm install

Run the following command with the path at the end replaced to point to the correct folder on your disk:

    npm config set playvienna_web_content /absolute/path/to/dropbox/folder/playvienna-web

Now you can use these two scripts:

`npm run dev` - Start a local server to try the site out in the browser on your computer  
`npm run build` - Build a release-ready version to the `public/` directory

## Deploying

Install `rsync` via your package manager, for example on Ubuntu:

    sudo apt install rsync

Now you can also use these two deployment scripts:

`npm run deploy` - Deploy `public/` to the live server  
`npm run release` - Build and deploy in one go
