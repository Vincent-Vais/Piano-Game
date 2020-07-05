// ################ VARIABLES ################
let keysArray = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'high-c-key', 'c-sharp-key', 'd-sharp-key', 'f-sharp-key', 'g-sharp-key', 'a-sharp-key']; 
let notes = []; // keys is a list with of id's that piano keys have; notes is an array of selected keys
let lyricsArray =[]; //we need it for colloring lyrics
let newLyricsArray = []; 
let order = []; // we need it to determine if user pressed the right key
let counter = 0; // we need it to keep track of changing lines
let keyReleased = false; // we need it to control piano notes

const keyData = {
    c: {
        sound: new Howl({
        src: ['./sounds/A262398373B5.mp3']})
    },
    d: {
        sound: new Howl({
        src: ['./sounds/D262398383B5.mp3']})
    },
    e: {
        sound: new Howl({
        src: ['./sounds/E262398383B5.mp3']})
    },
    f: {
        sound: new Howl({
        src: ['./sounds/F262398373B5.mp3']})
    },
    g: {
        sound: new Howl({
        src: ['./sounds/G262398373B5.mp3']})
    },
    a: {
        sound: new Howl({
        src: ['./sounds/A262398373B5.mp3']})
    },
    b: {
        sound: new Howl({
        src: ['./sounds/B262398373B5.mp3']})
    }
};


const lyricsObj = {
    lyrics: document.querySelectorAll('#lyrics >section'),
    lyricsLines: document.querySelectorAll('#lyrics section:first-child'), 
    lyricsKeys: document.querySelectorAll('#lyrics section:last-child'),
    i: 0,
    hide(){
        for(let i = 0; i < this.lyrics.length; i++){
            console.log(this.lyrics[i]);
            this.lyrics[i].hidden = true;
            this.lyrics[i].style.display = "none";
        }
    },
    start(){
        this.hide();
        let j = 1;
        this.text[this.i].lines.forEach(w => {
            if(this.lyricsLines[j].id != 'column-1'){
                this.lyrics[j-1].hiden = false;
                this.lyrics[j-1].style.display = "inline-block";
                this.lyricsLines[j].style.display = "inline-block";
                this.lyricsLines[j].textContent = w;
                j++;
            }
            else{
                j++;
            }
        });
        j = 0;
        this.text[this.i].keys.forEach(w => {
            this.lyricsKeys[j].style.display = "inline-block";
            this.lyricsKeys[j].textContent = w;
            j++;
        });
    },
    next() {
        console.log(`I: ${this.i}`);
        if(this.i === 2){
            this.i = 0;
            this.start()
        }else{
            this.hide();
            let j = 1;
            this.text[this.i+1].lines.forEach(w => {
                if(this.lyricsLines[j].id != 'column-1'){
                    this.lyrics[j-1].hiden = false;
                    this.lyrics[j-1].style.display = "inline-block";
                    this.lyricsLines[j].style.display = "inline-block";
                    this.lyricsLines[j].textContent = w;
                    j++;
                }
                else{
                    j++;
                }
                
            });
            j = 0;
            this.text[this.i+1].keys.forEach(w => {
                this.lyricsKeys[j].style.display = "inline-block";
                this.lyricsKeys[j].textContent = w;
                j++;
            });
            this.i++;
        }
    },
    text: [
        {
            lines: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'TO', 'YOU'],
            keys: ['G', 'G', 'A', 'G', 'C', 'B']
        },
        {
            lines:['HAP-', 'PY', 'BIRTH-', 'DAY', 'DEAR', 'FRI-', 'END'],
            keys: ['G', 'G', 'G', 'E', 'C', 'B', 'A']
        },
        {
            lines: ['HAP-', 'PY', 'BIRTH-', 'DAY', 'TO', 'YOU'],
            keys: ['F', 'F', 'E', 'C', 'D','C']
        }
    ]
}

const buttonsObj = {
    buttons: document.querySelectorAll('button'),
    i : 0,
    start() {
        this.buttons[0].hidden = false;
        this.buttons[1].hidden = true;
        this.buttons[2].hidden = true;
        this.buttons[3].hidden = true;
    },
    next() {
        console.log(`I: ${this.i}`);
        if(this.i == 2){
            this.start();
            this.i = 0;
        }
        else{
            if(this.i< this.buttons.length){
                this.buttons[this.i].hidden = true;
                this.buttons[this.i + 1].hidden = false;
                this.i++;
            } 
        }
    }
}

lyricsObj.start();
buttonsObj.start();
// ################ POPULATING ARRAYS FOR GAME LOGIC ################
const resetOrder = () => {
    document.querySelectorAll('#lyrics section').forEach(section => {
        lyricsArray.push(section);
        if(section.children[1] && window.getComputedStyle(section, null).getPropertyValue("display") !== "none"){
            order.push(section.children[1].textContent);
            
        }
    });
    console.log(`Order created: ${order}`);
    lyricsArray.forEach(lyric => {
        if(lyric.id.indexOf('column') ==0){
            newLyricsArray.push(lyric);
        };
    })
}

resetOrder();


// ################ SELECTING ELEMENTS ################
keysArray.forEach(key => {
    notes.push(document.getElementById(key)) // select keys now. store them in notes. then add even handlers
});

let lyrics = document.querySelectorAll('#lyrics section') // lyrics boxes(text + key)


// ################ CREATE EVENT HANDLERS ################

const changeColor = (tag) => {
    tag.classList.toggle("pressed");
};

// const addSound = (key) => {
//     will add a generate a sound
// }; 

// 1. Main handler
const globalHandler = (event) => {
    if(event.type === "click"){
        changeColor(event.target); // change color on key
        // keyData[event.target.textContent.trim().toLowerCase()]
    }else if(event.type === "keydown"){
        if(!keyReleased){
            let noteToChange = notes.filter(note => note.id === `${event.key}-key`);
            console.log(`YOU PRESSED: ${noteToChange[0].id}`);
            noteToChange[0].classList.add("pressed") // change color on key
            keyData[event.key].sound.play();
            lyricsHandler(noteToChange[0])
            keyReleased = true;
        }
    }else{
        keyReleased = false;
        let noteToChange = notes.filter(note => note.id === `${event.key}-key`);
        noteToChange[0].classList.remove("pressed") // change color on key
    }
} 

// 2. Lyrics Handler
const lyricsHandler = (tag) => {
    console.log(`YOU PASSED ${tag} to lyricsHandler`);
    let pressedKey = tag.id[0];
    console.log(`LyricsHandler works with ${pressedKey}`);
    if(pressedKey.toUpperCase() === order[0]){
        order.shift()
        console.log(`ORDER CHANGED: ${order}`);
        counter++;
        for(let i = 0; i < newLyricsArray.length; i++){
            if(`column-${counter}` === newLyricsArray[i].id){
                newLyricsArray[i].classList.add("pressed");
                break
            }
        }
        if(order.length === 0 || order[0] === ""){
            console.log("GONNAR CALL RESET");
            setTimeout(reset, 1000);
            return
        }
    }
    else{
        console.log(pressedKey.toUpperCase());
        console.log(order[0]);
        buttonsObj.i = 2;
        lyricsObj.i = 2;
        reset();
        return
    }
}

// ################ ADD EVENT LISTENERS ################

// 1. Piano
notes.forEach(note => {
    note.addEventListener("click", globalHandler);
});

document.addEventListener("keyup", globalHandler);
document.addEventListener("keydown", globalHandler);


const resetColors = () => {
    for(let i = 0; i < newLyricsArray.length; i++){
        newLyricsArray[i].classList.remove("pressed");
    }
    
}

const reset = () => {
    order = [];
    counter = 0;
    buttonsObj.next();
    lyricsObj.next();
    resetOrder();
    resetColors();
}