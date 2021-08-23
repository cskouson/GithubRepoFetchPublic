/**
 * FetchGithub.js This 
 */

//global vars
let rObj = {};
let username = '';
let inUse = [];
let refresh = false;


//calculates user repo stats
function getStats() {
    let totIssues = 0;
    let currentHigh = 0;
    let leader = 'NONE';

    for (let i = 0; i < rObj.length; i++) {
        let issues = rObj[i].open_issues;
        totIssues += issues;
        if (issues > currentHigh) {
            currentHigh = issues;
            leader = rObj[i].name;
        }
    }
    let avg = totIssues / rObj.length;
    document.getElementById('avg-num-issues').innerHTML = avg.toPrecision(3);
    document.getElementById('repo-most-issues').innerHTML = leader;
}

//retrieves branch info of specified repo
//requires making an api call to different location as main repo information
function getBranches(repNum) {
    //clear branches div
    document.getElementById('branches-div').innerHTML = '';
    //get repo name
    let repo = rObj[repNum].name;
    fetch('https://api.github.com/repos/' + username + '/' + repo + '/branches')
        .then(resp => resp.json())
        .then(data => {
            //set global repo obj to most recent response
            let bhtml = '<br>';
            console.log(data.length);
            for (let i = 0; i < data.length; i++) {
                bhtml += 'name: ' + data[i].name + '<br>';
                bhtml += 'sha: ' + data[i].commit.sha + '<br>';
                bhtml += 'url: ' + data[i].commit.url + '<br>';
                bhtml += 'protected: ' + data[i].protected + '<br>';
                bhtml += '<hr>';
            }
            document.getElementById('branches-div').innerHTML += bhtml;
            //console.log(bhtml);
            //let branch
        })
        .catch(error => console.log('ERROR'));

}


//setup dropdown options after request
function initDropdown() {
    let iter = 7;
    if (rObj.length < 7) { iter = rObj.length; }
    for (let i = 2; i < iter; i++) {
        let opt = '<option value="' + i + '">' + rObj[i].name + '</option>';
        document.getElementById('dropdown').innerHTML += opt;
    }
}


//adds entry on dropdown select
function addEntry() {
    let select = document.getElementById('dropdown');
    let i = select.options[select.selectedIndex].value;
    let ent1 = '<tr>';
    ent1 += '<td>' + rObj[i].name + '</td>';
    ent1 += '<td>' + rObj[i].created_at + ' ' + rObj[i].updated_at + '</td>';
    ent1 += '<td>' + rObj[i].size + '</td>';
    ent1 += '<td>' + rObj[i].forks_count + '</td>';
    ent1 += '<td>' + rObj[i].html_url + '</td>';
    ent1 += '<td>' + rObj[i].language + ' ' + rObj[i].languages_url + '</td>';
    ent1 += '<td>' + rObj[i].downloads_url + '</td>';
    ent1 += '<td><button type="button" onclick="getBranches(' + i + ')" value=' + i + '>branches</button></td>';
    document.getElementById('repo-table').innerHTML += ent1;
    inUse.push(parseInt(i));
}


//initial table display for a request
function initTable() {
    //clear everything
    document.getElementById('repo-table').innerHTML = '<tr><th>Repo Name</th><th>TimeStamps: Created & Updated</th><th>Size</th>'
        + '<th>Number of Forks</th><th>HTML Url</th><th>List of Languages and Language Url</th><th>Downloads Url</th><th>Branches</th></tr>';
    document.getElementById('branches-div').innerHTML = '';
    document.getElementById('dropdown').innerHTML = '<option value="empty">No Selection</option>';
    inUse = [];
    //set table
    let iter = 2;
    if (rObj.length < 2) { iter = rObj.length; }
    for (let i = 0; i < iter; i++) {
        let ent1 = '<tr>';
        ent1 += '<td>' + rObj[i].name + '</td>';
        ent1 += '<td>' + rObj[i].created_at + ' ' + rObj[i].updated_at + '</td>';
        ent1 += '<td>' + rObj[i].size + '</td>';
        ent1 += '<td>' + rObj[i].forks_count + '</td>';
        ent1 += '<td>' + rObj[i].html_url + '</td>';
        ent1 += '<td>' + rObj[i].language + ' ' + rObj[i].languages_url + '</td>';
        ent1 += '<td>' + rObj[i].downloads_url + '</td>';
        ent1 += '<td><button type="button" onclick="getBranches(' + i + ')" value=' + i + '>branches</button></td>';
        document.getElementById('repo-table').innerHTML += ent1;
        inUse.push(i);
    }
    initDropdown();
    getStats();
}


//fetch user github repos
function getUserRepos() {
    username = document.getElementById('username').value;
    fetch('https://api.github.com/users/' + username + '/repos')
        .then(resp => resp.json())
        .then(data => {
            //set global repo obj to most recent response
            rObj = data;
            initTable();
        })
        .catch(error => console.log('ERROR'));
}

function refr() {
    //clear table
    document.getElementById('repo-table').innerHTML = '<tr><th>Repo Name</th><th>TimeStamps: Created & Updated</th><th>Size</th>'
        + '<th>Number of Forks</th><th>HTML Url</th><th>List of Languages and Language Url</th><th>Downloads Url</th><th>Branches</th></tr>';
    //make api call for updated information
    fetch('https://api.github.com/users/' + username + '/repos')
        .then(resp => resp.json())
        .then(data => {
            //set global repo obj to most recent response
            rObj = data;
            for (let x = 0; x < inUse.length; x++) {
                let ent1 = '<tr>';
                ent1 += '<td>' + rObj[inUse[x]].name + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].created_at + ' ' + rObj[inUse[x]].updated_at + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].size + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].forks_count + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].html_url + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].language + ' ' + rObj[inUse[x]].languages_url + '</td>';
                ent1 += '<td>' + rObj[inUse[x]].downloads_url + '</td>';
                ent1 += '<td><button type="button" onclick="getBranches(' + inUse[x] + ')" value=' + inUse[x] + '>branches</button></td>';
                document.getElementById('repo-table').innerHTML += ent1;
            }
        })
        .catch(error => console.log('ERROR'));
}