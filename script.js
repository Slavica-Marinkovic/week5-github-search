const body = document.getElementsByTagName("body")[0];
const select = (elem) => document.querySelector(elem);
const modeButton = select('.mode');
const modeText = select('.mode-text');
const modeImg = document.getElementsByTagName('img')[0];
const url = 'https://api.github.com/users/';
const btnSearch = select('.btn-search');
const input = select('.entry');
const error = select('.error');
const fullName = select('.full-name');
const userName = select('.user-name');
const infoDate = select('.info-date');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var date;
const imageAvatar = select('.image');
const bioText = select('.bio-text');
const repos = select('.repos');
const followers = select('.followers');
const following = select('.following');
const locate = select('.location');
const blogElem = select('.link');
const twitter = select('.twitter');
const company = select('.company');

input.addEventListener('click', function(e){
    input.value = "";
    error.style.display = "none";
});

modeButton.addEventListener('click', function(e){
    e.preventDefault();
    if(body.classList.contains("dark")){
        lightMode();
    } else {
       darkMode();
    }
});
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkMode();
}
btnSearch.addEventListener('click', function(e){
    e.preventDefault();
    if(input.value !== ""){
        getUser(url+input.value);
    }
    input.value = "";
});
input.addEventListener("keydown", function(e) {
    if (e.key == "Enter") { 
        if (input.value !== ""){
            getUser(url+input.value);
            input.value = "";
        }
    }
});

function lightMode() {
    body.classList.remove("dark");
        modeText.innerHTML = "DARK";
        modeImg.src = "assets/icon-moon.svg";
        modeImg.style.filter= "none";
}
function darkMode() {
    body.classList.add("dark")
    modeText.innerHTML = "LIGHT";
    modeImg.src = "assets/icon-sun.svg";
    modeImg.style.filter = "invert(63%) sepia(100%) saturate(209%) hue-rotate(184deg) brightness(130%) contrast(90%)";
}

function getUser(userUrl) {
    var request = new XMLHttpRequest();
    request.open("GET",userUrl,true);
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var response = JSON.parse(this.responseText);
            updateUser(response);
        }
            if(this.status == 404) {
            error.style.display = "block";
            }
    }
    request.send();
}

function updateUser(user) {
    resetStyle(locate);
    resetStyle(blogElem);
    resetStyle(twitter);
    resetStyle(company);

    fullName.innerHTML = (checkEmpty(user.name) == true)? user.name : user.login;
    userName.innerHTML = "@"+user.login;
    date = new Date(user.created_at);
    infoDate.innerHTML = date.getDate() + " " + (months[date.getMonth()]) + " " + date.getFullYear();
    imageAvatar.style.background = 'url('+user.avatar_url+')';
    imageAvatar.style.backgroundSize = "cover";

    if(!checkEmpty(user.bio)) {
        bioText.innerHTML = "This profile has no bio";
        bioText.style.opacity = "0.75";
    }
    else {
        bioText.innerHTML = user.bio;
    }
    repos.innerHTML = user.public_repos;
    followers.innerHTML = user.followers;
    following.innerHTML = user.following;

    function noAvailable(elem,prop){
        if(checkEmpty(prop)) {
            elem.innerHTML = prop;
            elem.href = prop;
            elem.setAttribute("target","_blank");
        }
        else {
            elem.innerHTML = "Not Available";
            elem.style.pointerEvents = "none";
            elem.parentElement.parentElement.style.opacity = "0.5";
        }
    }
    function resetStyle(elem){
        elem.parentElement.parentElement.style.opacity = "1";
        elem.style.pointerEvents = "auto";
    }

    noAvailable(locate,user.location);
    locate.style.pointerEvents = "none";
    noAvailable(blogElem,user.blog);
    noAvailable(twitter,user.twitter_username);
    noAvailable(company,user.company);
    if(company.textContent != "Not Available"){
        let companyString = company.textContent.slice(1);
        company.href = "https://github.com/" + companyString;
    }
}

function checkEmpty(userData){
    if(userData == "" || userData == null){
        return false;
    }
    else {
        return true;
    }
}

getUser('https://api.github.com/users/octocat');