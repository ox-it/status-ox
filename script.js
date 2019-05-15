const url = 'https://status.ox.ac.uk/api/services.json';

if (window.jQuery) {
    window.jQuery( document ).ready(function() {
        startScript()
    });
} else {
    startScript()
}
function startScript() {
    // fetch data from http://status.ox.ac.uk/api/services.json
    fetch(url)
    .then( response => {
        if(response.status == 200) {
            return response.json()
            .then( json => {
                addDataToDom(json);
            })
        } else {
            console.warn('Unable to fetch from', url);
        }
    })
}


// function to convert data to DOM elements and add them to the DOM
function addDataToDom(data) {
    var container = document.getElementById("status-container");
    var statusDiv = document.createElement("div");
    statusDiv.setAttribute('class', 'status');

    statusDiv.appendChild(headerEl(data.overall_status_name, data.last_updated));
    statusDiv.appendChild(accWrapperEl(data.groups));
    
    container.appendChild(statusDiv);
    
    addAnnouncementsToDom();
}

// create the header to show the overall status of services
function headerEl(overallStatusName, lastUpdated) {
    var text;
    var d = new Date(lastUpdated);
    var dOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    if (overallStatusName == "Up") {
        text = "Systems running smoothly as of " + d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
    } else if (overallStatusName == "Partial") {
        text = "Systems partially running as of " + d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
    } else if (overallStatusName == "Down") {
        text = "Some systems are down as of " + d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
    }
    var node = document.createElement("h3");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    return node;
}

// create the Dom element for the accordion wrapper
function accWrapperEl(groups) {
    // create the accordion wrapper
    var wrapper = document.createElement("div");
    wrapper.setAttribute('class', 'css-accordion-wrapper');
    var half = document.createElement("div");
    half.setAttribute('class', 'css-accordion-half');
    // convert the data for each service to Dom elements and add them to the wrapper
    groups.forEach(function (g, idx) {
        half.appendChild(groupEl(g, idx));
    })
    wrapper.appendChild(half);
    return wrapper;
}

// create the element for each group of services
function groupEl(g, idx) {
    var tab = document.createElement("div");
    tab.setAttribute('class', 'css-accordion-tab ' + g.status_name);
    
    var input = document.createElement("input");
    input.setAttribute('id', 'tab-'+idx);
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'tabs');
    tab.appendChild(input);
    
    // create the label
    var label = document.createElement("label");
    label.setAttribute('for', 'tab-'+idx);
    
    // add status and service name to the label
    var statusLabel = document.createElement("div");
    statusLabel.setAttribute('class', 'css-accordion-group-status ' + g.status_name);
    statusLabel.innerHTML = g.status_name;
    label.appendChild(statusLabel);
    var nameLabel = document.createElement("div");
    nameLabel.setAttribute('class', 'css-accordion-group-name');
    nameLabel.innerHTML = g.name;
    label.appendChild(nameLabel);
    tab.appendChild(label);
    
    // add the services of the group
    var div = document.createElement("div");
    div.setAttribute('class', 'css-accordion-tab-content');
    g.services.forEach(function (s, i) {
        div.appendChild(servicesEl(s, i));
    })
    
    tab.appendChild(div);
    return tab;
}

// create element for a service
function servicesEl(s, idx) {
    var div = document.createElement("div");
    div.setAttribute('class', 'css-accordion-service');
    
    var status = document.createElement("div");
    status.setAttribute('class', 'css-accordion-service-status '+ s.status_name);
    status.innerHTML = s.status_name;
    div.appendChild(status);
    
    var name = document.createElement("name");
    name.setAttribute('class', 'css-accordion-service-name');
    name.innerHTML = s.name;
    div.appendChild(name);
    
    return div;
}

function addAnnouncementsToDom(data) {
    const announcementsUrl = 'https://status.ox.ac.uk/api/announcements.json';

    fetch(announcementsUrl)
    .then( response => {
        if(response.status == 200) {
            return response.json()
            .then( json => {
                var container = document.getElementById("status-container");
                var announcementsDiv = document.createElement("div");
                announcementsDiv.setAttribute('class', 'announcements');
                var announcementsTitle = document.createElement("h3");
                announcementsTitle.innerHTML = 'Announcements';
                announcementsDiv.appendChild(announcementsTitle)
                
                var announcementsItems = document.createElement("div");
                if (json.length) {
                    var dOptions = { year: 'numeric', month: 'long', day: 'numeric' }
                    json.forEach( an => {
                        var announcementItem = document.createElement("div");
                        announcementItem.setAttribute('class', 'announcement-item');

                        var d = new Date(an.start_time);
                        var datesString = d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
                        if (an.end_time) {
                            datesString += ' - ';
                            d = new Date(an.end_time);
                            datesString += d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
                        }
                        var announcementDates = document.createElement("b");
                        announcementDates.setAttribute('class', 'announcement-date');
                        announcementDates.innerHTML = datesString;
                        announcementItem.appendChild(announcementDates)

                        var announcementMessage = document.createElement("div");
                        announcementMessage.setAttribute('class', 'announcement-message');
                        announcementMessage.innerHTML = an.message;
                        announcementItem.appendChild(announcementMessage)
                        
                        var announcementModified = document.createElement("div");
                        announcementModified.setAttribute('class', 'announcement-last-modified');
                        d = new Date(an.last_modified);
                        datesString = d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
                        announcementModified.innerHTML = 'Last update: '+ datesString;
                        announcementItem.appendChild(announcementModified)

                        announcementsItems.appendChild(announcementItem);
                    })
                } else {
                    announcementsItems.innerHTML = 'No announcements at present'
                }
                
                announcementsDiv.appendChild(announcementsItems);

                container.appendChild(announcementsDiv);
            })
        } else {
            console.warn('Unable to fetch from', url);
        }
    })
    
}
