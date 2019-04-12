console.log("xa");
const url = 'http://status.ox.ac.uk/api/services.json';
fetch(url)
.then( response => {
    if(response.status == 200) {
        return response.json()
        .then( json => {
            console.log("json", json);
            
        })
    } else {
        console.warn('Unable to fetch from', url);
    }
})