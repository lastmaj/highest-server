const axios = require("axios");
const loginURL = "https://users.premierleague.com/accounts/login/";
const axiosInstace = axios.create({ baseURL: loginURL });

//implement array.flat()
Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});

//set cookie manually, then attach it to axios's headers
const createSession = () => {
  const cookie =
    "pl_profile=set your cookie manually here";
  axiosInstace.defaults.headers.Cookie = cookie;
};

//get the max standing from a standings page
const getMaxFromPage = results => {
  const maxPoints = results.reduce((prev, curr) =>
    prev.event_total > curr.event_total ? prev : curr
  )["event_total"];
  return results.filter(r => r.event_total === maxPoints);
};

//post a request for standings then return the max on that page
const getMax = async leagueId => {
  createSession();
  //initialization
  let page = 1;
  let maxs = [];
  let start = new Date().getTime();

  //1st request is always made
  firstRes = await axiosInstace.get(
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=1&phase=1`
  );
  standings = await firstRes.data.standings;
  results = await standings.results;

  //if there are results, carry on
  while (results.length !== 0) {
    console.log(`Reading page no: ${page}`);
    let pageMax = getMaxFromPage(await results);
    maxs.push(pageMax);

    //make the next request
    page++;
    res = await axiosInstace.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
    );
    standings = await res.data.standings;
    results = await standings.results;
  }

  //helper array
  const winners = [];
  const helperArray = maxs.map(x => x[0]["event_total"]);
  const globalMax = Math.max(...helperArray);

  //iterate through maxs and helperArray
  let index = helperArray.indexOf(globalMax);
  while (index !== -1) {
    winners.push(maxs[index]);
    index = helperArray.indexOf(globalMax, index + 1);
  }

  //display time
  let end = new Date().getTime();
  let time = end - start;
  console.log("Execution time: " + time / 1000 + "s");
  const a = winners.flat().map(w => ({
    name: w.entry_name,
    points: w.event_total,
    url: `https://fantasy.premierleague.com/entry/${w.entry}/history`
  }));
  const result = {
    winners: a,
    execution_time: time / 1000 + " s",
    league_total_pages: page - 1
  };
  return result;
};

module.exports = getMax;
