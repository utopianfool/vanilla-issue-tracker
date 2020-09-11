/* Navigation */
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const social = document.querySelector('.social-links');
    // get all nav links
    const navLinks = document.querySelectorAll('.nav-links li');
    const socialLinks = document.querySelectorAll('.social-links a');

    // Toggle nav
    burger.addEventListener('click', function() {
        nav.classList.toggle('nav-active');
        social.classList.toggle('nav-active');

        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + 0.3}s`; // add delay at end
            }
        });

        socialLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + 0.3}s`; // add delay at end
            }
        });

        // Animate burger
        burger.classList.toggle('toggle');
    });

}

/* Use fetch api to get list of projects hosted elsewhere */
const projectsList = () => {

    var address = config.api; // Use config.js to hide api
    // Get json data from url
    const proxy = 'https://cors-anywhere.herokuapp.com/'; // use proxy to fix cors on localhost
    const url = `${proxy}${address}`;


    fetch(url) 
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data);
            appendData(data);
        })
        .catch(function (error) {
            console.log(error);
        });
    function appendData(data) {
        var subMenu = document.querySelector('.sub-menu');
        for(var i = 0; i < data.length; i++) {
            var listItem = document.createElement('li');
            listItem.innerHTML = '<a target="_blank" rel="noopener" title="' + data[i].description + '" href="' + data[i].link_url + '">' + data[i].link_text + '</a>';
            subMenu.appendChild(listItem);
        }
    } // https://howtocreateapps.com/fetch-and-display-json-html-javascript/

}

const app = () => {
    navSlide();
    projectsList();
}

app();

// Send data to local storage when user clicks on form, add event handler saveIssue when user submits
document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

// implement saveIssue function
function saveIssue(e) {
    // define variables and assign user input values
    var issueDesc = document.getElementById('issueDescInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    // create identifier for the issue using chance js library to generate global unique id
    var issueId = chance.guid();
    // set initial status to open
    var issueStatus = 'Open';

    // create new issue object
    var issue = {
        id: issueId,
        description: issueDesc,
        severity: issueSeverity,
        assignedTo: issueAssignedTo,
        status: issueStatus
    }

    // insert object into local storage and check if local storage is empty
    if (localStorage.getItem('issues') == null) {
        // initialise empty array
        var issues = [];
        // push issue object into array
        issues.push(issue);
        // use local storage again to set 'issues' key to value of issues array, stringify = takes array and generates JSON object
        localStorage.setItem('issues', JSON.stringify(issues));
    } else {
        // if something in local storage retrieve data, JSON.parse generates array and assign to issues
        var issues = JSON.parse(localStorage.getItem('issues'));
        // extend array by adding new issue
        issues.push(issue);
        // send back to local storage
        localStorage.setItem('issues', JSON.stringify(issues));
    }

    // reset input elements
    document.getElementById('issueInputForm').reset();
    // call fetchIssues function again to list output is regenerated and new element is included
    fetchIssues();
    // prevent form from submitting
    e.preventDefault();
}

// Close status button taking parameter of id of issue item
function setStatusClosed(id) {
    // retrieve data from local storage and put into array of issues
    var issues = JSON.parse(localStorage.getItem('issues'));
    // interate over stored elements and compare id of parsed element
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id == id) {
            issues[i].status = 'Closed';
        }
    }

    // now change is made write back into local storage
    localStorage.setItem('issues', JSON.stringify(issues));
    // update output
    fetchIssues();
}

// Delete button
function deleteIssue(id) {
    // retrieve data from local storage and put into array of issues
    var issues = JSON.parse(localStorage.getItem('issues'));
    // interate over stored elements and compare id of parsed element
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id == id) {
            // remove 1 element from the array
            issues.splice(i, 1);
        }
    }

    // now change is made write back into local storage
    localStorage.setItem('issues', JSON.stringify(issues));
    // update output
    fetchIssues();
}

function fetchIssues() {
    // retrieve issues from browser storage
    var issues = JSON.parse(localStorage.getItem('issues'));
    // target issuesList div 
    var issuesListe = document.getElementById('issuesList');
    // initialise content and set to empty string
    issuesList.innerHTML = '';
    // interate over loop of issue items in issues object and generate output 
    for (var i = 0; i < issues.length; i++) {
        // define variable id and assign issues with index i, using property id
        var id = issues[i].id;
        var desc = issues[i].description;
        var severity = issues[i].severity;
        var assignedTo = issues[i].assignedTo;
        var status = issues[i].status;
        // generate html output
        issuesList.innerHTML += '<div class="well">'+
                                '<h6>Issue ID: ' + id + '</h6>'+
                                '<p><span class="label label-info">' + status + '</span></p>'+
                                '<h3>' + desc + '</h3>'+
                                '<p><span class="glyphicon glyphicon-time"></span> ' + severity + '</p>'+
                                '<p><span class="glyphicon glyphicon-user"></span> ' + assignedTo + '</p>'+
                                // add event handler to click and assign method call and call function setStatusClosed to close issue then pass the current id of element into function setStatusClosed(\''+id+'\')
                                '<a href="#" onclick="setStatusClosed(\''+id+'\')" class="btn btn-warning">Close</a> '+
                                '<a href="#" onclick="deleteIssue(\''+id+'\')" class="btn btn-danger">Delete</a>'+
                                '</div>';

    }
}