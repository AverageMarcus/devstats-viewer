const btn = document.querySelector("#find");
const gh = document.querySelector("#github");
const result = document.querySelector("#result");
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
  let user = gh.value.toLowerCase();
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
      body: "{\"api\":\"DevActCnt\",\"payload\":{\"project\":\"all\",\"range\":\"Last decade\",\"metric\":\"Contributions\",\"repository_group\":\"All\",\"country\":\"All\",\"github_id\":\"" + user + "\",\"bg\":\"\"}}",
    })
    .then(res => res.json())
    .then(data => {
      statusUpdate("", "info");
      let score = data.number[0];
      if (score) {
        result.innerHTML = score;
        rawResults.innerText = JSON.stringify(data, "", 2)
        rawResultsWrapper.classList.remove('hidden');
      } else {
        statusUpdate(`Failed to get devstats score for '${user}'`, "error");
      }
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
