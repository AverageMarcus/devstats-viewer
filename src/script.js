const btn = document.querySelector("#find");
const gh = document.querySelector("#github");
const result = document.querySelector("#result");
const subResult = document.querySelector("#subResult");
const status = document.querySelector("#status");

const rawResultsWrapper = document.querySelector("#rawResultsWrapper");
const rawResults = document.querySelector("#rawResults");

// Parse URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');

// Fill form with user parameter
if (user) {
  gh.value = user;
  find(); // Call the find function automatically
}

function find() {
  let user = gh.value.trim().toLowerCase();
  if (user != "") {
    statusUpdate(`Fetching devstats score for '${user}'`, "info");
    rawResultsWrapper.classList.add('hidden');
    fetch("https://devstats.cncf.io/api/v1", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: "{\"api\":\"GithubIDContributions\",\"payload\":{\"github_id\":\"" + user + "\"}}",
    })
    .then(res => res.json())
    .then(data => {
      statusUpdate("", "info");
      let score = data.contributions;
      if (!score) {
        statusUpdate(`Failed to get devstats score for '${user}'.\nEither user doesn't exist or no contributions recorded.`, "error");
      }
      result.innerHTML = score;
      subResult.innerHTML = `Issues: ${data.issues} | PRs: ${data.prs}`;
      rawResults.innerText = JSON.stringify(data, "", 2)
      rawResultsWrapper.classList.remove('hidden');
    })
    .catch(err => {
      statusUpdate(`Failed to get devstats score for '${user}'`, "error");
      console.log(err);
    });

    // Change the URL
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    params.set('user', user);
    window.history.replaceState({}, '', `${url.pathname}?${params}`);
  }
}

function statusUpdate(msg, statusClass) {
  console.log(msg);
  status.innerText = msg;
  status.className = statusClass;
}

gh.onkeypress = function(event) {
  if (event.keyCode == 13) {
    find();
  }
}

btn.onclick = find;
