const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAcess=document.querySelector(".grant-location-container");
const mainWeather=document.querySelector(".user-info-container");
const searchWeather=document.querySelector("[data-searchForm]");
const load=document.querySelector(".loading-container");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");


//using this we are able to toggle backgroung colors of search and your weather button
function switchTab(newTab){
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        
        if(!searchTab.classList.contains("active")){
            //matlab searchtab ko visible krna padega
            mainWeather.classList.remove("active");
            grantAcess.classList.remove("active");
            searchWeather.classListadd("active");
        }
        else{
            //ab hume main weather page ko dikhana padega
            searchWeather.classList.remove("active");
            grantAcess.classList.remove("active");
            //DOUBT
            mainWeather.classList.add("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
};

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//ab hume main weather display krna hai, isliye hum apne local storage me check krenge ki coordiantes hai ya 
//nhi ..agar nhi to hum geolocation se apna location save krva ke vo display krenge


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAcess.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
};

//ab hum humara main fetch api ka code likhenge
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    load.classList.add("active");
    try{
        let content =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let output=await content.json();
        load.classList.remove("active");
        mainWeather.classList.add("active");
        renderWeatherInfo(output);
    }
    catch(err){
        console.log("Error Found "+err);
    }
};

//now to display all the data, we need to make a function
function renderWeatherInfo(weatherInfo){
        //fistly, we have to fethc the elements 

        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");
    
        //fetch values from weatherINfo object and put it UI elements
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity} %`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
        alert("Geolocation is not supported");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchWeather.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    load.classList.add("active");
    mainWeather.classList.remove("active");
    grantAcess.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        load.classList.remove("active");
        mainWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}
