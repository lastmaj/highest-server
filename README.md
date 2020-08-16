# highest-server
This is the server-side logic running [on this website](https://highest-fpl.herokuapp.com/) to find the highest scoring player for just the current gameweek (for a certain league)
in the Fantasy Premier League game. This tool is developed for a local fpl community in Tunisia.

## Getting started
Clone the repo and install the dependencies.
```bash
git clone https://github.com/lastmaj/highest-server.git
cd highest-server
npm install
```

## Setting up
This script runs off data from the fpl api and hits the league ranking endpoints. These endpoints require authentication. For that reason, you need to set your cookie manually in
the **`highest.js`** file. You're then good to go.
