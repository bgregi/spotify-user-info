# What's My Taste? - A Spotify API Web App

This web app shows the user their Spotify top artists and tracks, as well as some of their musical preferences, based on said top tracks. It's a great tool to know more about your own musical tastes and how they develop over time, or to compare your preferences with those of your friends.

## Important Note
This app is finished, but currently can't be accessed by anyone who's not registered. This is because I'm still waiting for Spotify's approval to make it go public. If you're interested in using it, e-mail me at bgeraldir@gmail.com and I'll register your Spotify account with it.

## Built With
- React (create-react-app)
- Typescript
- Bootstrap
- Recoil
- Spotify Web API Node
- DayJS

## API Endpoints Used
- Get Current User's Profile -> Used to get the user's name and profile picture
- Get User's Top Items -> Used to get the user's top 50 artists and top 50 tracks
- Get Tracks' Audio Features -> Used to get the user's top 50 tracks' audio features, like acousticness, duration, energy, valence etc.

## How It Works
The first thing the user sees is the login page, which asks the user to login to Spotify. If the login is successful, the user is redirected to the Dashboard, which is the main page for the application.

The redirected URI is the one registered at the Spotify for Developers Dashboard for this specific app. It redirects the user to the registered URI, along with a code at the end of the URI. This code is stored in a state using Recoil.

The component useAuth uses this code to make a request to the server, which is hosted at Heroku. This is necessary because the server is going to make requests to the Spotify API using the CLIENT_SECRET, which must be kept secret. This is made through environment variables within the Heroku server. You can check the server's code in the "server-mock" folder.

The server's response is the access token, which is stored in another Recoil state. useAuth also makes regular calls to the server to refresh the token when it expires. The access token is then used to make all the API calls.

## Thanks
The authorization procedure, along with the server coding, was borrowed from the youtuber Web Dev Simplified, who made a great video about it. Check it out [here](https://www.youtube.com/watch?v=Xcet6msf3eE).

## Screenshots

![Login page](./src/assets/login.png)

![Dashboard](./src/assets/dashboard.png)