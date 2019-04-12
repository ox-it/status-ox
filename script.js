const url = 'http://status.ox.ac.uk/api/services.json';

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

// function to convert data to DOM elements and add them to the DOM
function addDataToDom(data) {
    var container = document.getElementById("status-container");
    container.appendChild(headerEl(data.overall_status_code, data.overall_status_name, data.last_updated));
    container.appendChild(accWrapperEl(data.groups));
}

// create the header to show the overall status of services
function headerEl(overallStatusCode, overallStatusName, lastUpdated) {
    var text;
    var d = new Date(lastUpdated);
    var dOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    if (overallStatusCode == 0) {
        text = "Systems running smoothly as of " + d.toLocaleTimeString("en-UK") +", "+ d.toLocaleDateString("en-UK", dOptions);
    }
    var node = document.createElement("div");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    return node;
}

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

function groupEl(g, idx) {
    var tab = document.createElement("div");
    tab.setAttribute('class', 'css-accordion-tab ' + g.status_name);
    
    var input = document.createElement("input");
    input.setAttribute('id', 'tab-'+idx);
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'tabs');
    tab.appendChild(input);
    
    var label = document.createElement("label");
    label.setAttribute('for', 'tab-'+idx);
    
    var statusLabel = document.createElement("div");
    statusLabel.setAttribute('class', 'css-accordion-group-status');
    statusLabel.innerHTML = g.status_name;
    label.appendChild(statusLabel);
    var nameLabel = document.createElement("div");
    nameLabel.setAttribute('class', 'css-accordion-group-name');
    nameLabel.innerHTML = g.name;
    label.appendChild(nameLabel);
    
    tab.appendChild(label);
    
    var div = document.createElement("div");
    div.setAttribute('class', 'css-accordion-tab-content');
    g.services.forEach(function (s, i) {
        div.appendChild(servicesEl(s, i));
    })
    
    tab.appendChild(div);
    return tab;
}

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