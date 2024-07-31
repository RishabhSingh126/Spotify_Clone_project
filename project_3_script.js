console.log("Lets write javascript")
let currentsong = new Audio();
let songs;
let currfolder;
function secondsTominuteseconds(seconds)
{
    if(isNaN(seconds) || seconds<0)
    {
        /*return "Invalid input";*/
        return "00:00";
    }
    const minutes =Math.floor(seconds /60);
    const remainingseconds= Math.floor(seconds % 60);
    const formattedminutes= String(minutes).padStart(2,'0');
    const formattedseconds= String(remainingseconds).padStart(2,'0')

    return `${formattedminutes} : ${formattedseconds}`
}
async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let tds = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < tds.length; index++) {
        const element = tds[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    //Show all the songs in the playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML=" ";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +`<li><img class="musicsign invert" src="project_3_music.svg" alt="" srcset="">
        <div class="info invert">
            <div class="songname invert">${song.replaceAll("%20", " ")}</div>
            <div class="songartist invert">Song Artist</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
                <img class="playbutton invert" src="project_3_play.svg" alt="" srcset="">
        </div></li>`
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs;
}

/*const playmusic = (track)=>{
    let audio = new Audio("/songs/"+ track)
    currentsong.src="/songs/"+ track;
    currentsong.play();
    play.src="pause.svg";*/

    /*play.src="project_3_play.svg"*/
    /*document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}*/

//For set automatically first song
const playmusic = (track, pause=false)=>{
    //let audio = new Audio("/songs/"+ track)
    currentsong.src=`/${currfolder}/`+ track;
    if(!pause)
    {
        currentsong.play();
        play.src="pause.svg";
    }
    /*play.src="project_3_play.svg"*/
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function displayalbum(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div")
    div.innerHTML=response;
    let anchor = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[1]
            console.log(e.href.split("/").slice(-2)[1])
            //Get the metadata of the folder

            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML= cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg class="invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
                    height="24" color="#000000" fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="" srcset=""></img>
            <h2 class="invert">${response.title}</h2>
            <h3 class="invert">${response.description}</h3>
        </div>`
        }
    }
}

async function main() {
    
    //Getting the list of all songs

    //songs = await getsongs("songs/cs")
    await getsongs("songs/ncs")
    console.log(songs)
    playmusic(songs[0],true)

    //Display all the album on the page
    //displayalbum()

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="project_3_play.svg"
        }
    })

    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML= `${secondsTominuteseconds(currentsong.currentTime)} / ${secondsTominuteseconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration) *100 + "%";

    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX / e.target.getBoundingClientRect().width) *100;  /*getboundingclientrect is used to give height,width, x axis, y axis*/
        document.querySelector(".circle").style.left=percent +"%";
        currentsong.currentTime = (currentsong.duration*percent)/100;
    })

    //Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    //Add an event listener to close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "-120%"
    })

    //Add an event listener to previous button
    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        console.log(currentsong.src)
        console.log(currentsong.src.split("/").slice(-1)[0])    
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1) >= 0)
        {
            playmusic(songs[index-1])
        }
    })

    //Add an event listener to next button
    next.addEventListener("click",()=>{
        console.log("next clicked")
        console.log(currentsong.src)
        console.log(currentsong.src.split("/").slice(-1)[0])    
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length)
        {
            playmusic(songs[index+1])
        }
    })

    //Add an event listener to volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e, e.target , e.value)
        currentsong.volume= parseInt(e.target.value)/100;
    })

    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item => {
            console.log(item.target,item.currentTarget.dataset)//Currenttarget is used to perform event what is said to be done 
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            //playmusic(songs[1])
        })
    })

    //Add event listener to volume button
    document.querySelector(".volume > img").addEventListener("click",(e)=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg"))
        {
            e.target.src =ve.target.src.replace("volume.svg","mute.svg");
            currentsong.volume =0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume =0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
    })
    //Playing the song
    /*var audio = new Audio(songs[0]);
    audio.play();
    audio.addEventListener("loadeddata", () => {
        //let duration = audio.duration;
        //console.log(duration)
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
        // The duration variable now holds the duration (in seconds) of the audio clip
    });*/
}
main()
