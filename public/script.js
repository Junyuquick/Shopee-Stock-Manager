
const button = document.getElementById('startButton');

button.addEventListener('click', function() {
    console.log("clicked once");
    fetch('https://api.quickjunyu.com')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});