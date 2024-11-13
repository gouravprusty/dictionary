const search = document.querySelector("#search");
const input = document.querySelector("#input");

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
async function getMeaning(url){
    try{
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }catch(err){
        console.log(`Error fetching data: ${err}`);
        return null;
    }
};

function displayData(data){
    const container = document.querySelector(".data_container");
    container.innerHTML = "";

    if(Array.isArray(data)){
        data.forEach((el) => {
            const result = document.createElement("div");
            result.classList.add("result");
            
            const word = document.createElement("div");
            word.classList.add("word");
            result.appendChild(word);

            const word_p = document.createElement("p");
            word.appendChild(word_p);
            word_p.innerText = `${data.indexOf(el) + 1}.  ${el.word}`;

            let audioAvailable = false;
            for(let i = 0; i < el.phonetics.length; i++){
                if(el.phonetics[i].audio){
                    audioAvailable = true;

                    const listen = document.createElement("button");
                    word.appendChild(listen);
                    listen.innerHTML = '<i class="fa-solid fa-volume-high"></i>';

                    const audio = document.createElement("audio");
                    word.appendChild(audio);
                    audio.setAttribute("src", el.phonetics[i].audio);

                    listen.addEventListener("click", () => audio.play());

                    break;
                }
            }
            if(!audioAvailable){
                const noAudioMessage = document.createElement("span");
                noAudioMessage.innerText = "Audio not available.";
                noAudioMessage.classList.add("listen_p");
                word.appendChild(noAudioMessage);
            }

            const details = document.createElement("div");
            details.classList.add("details");
            result.appendChild(details);

            const speech = document.createElement("p");
            details.appendChild(speech);
            speech.innerText = el.meanings[0].partOfSpeech;
            
            const phonetic = document.createElement("p");
            details.appendChild(phonetic);

            for(let i = 0; i < el.phonetics.length; i++){
                if(el.phonetics[i].text){
                    phonetic.innerText = el.phonetics[i].text;
                    break;
                }else{
                    phonetic.innerText = "No data";
                }
            }

            const meaning = document.createElement("div");
            meaning.classList.add("meaning")
            result.appendChild(meaning);

            const mean_p = document.createElement("p");
            meaning.appendChild(mean_p);
            mean_p.innerText = el.meanings[0].definitions[0].definition

            const example = document.createElement("div");
            example.classList.add("example")
            result.appendChild(example);

            const example_p = document.createElement("p");
            example.appendChild(example_p);

            if(el.meanings[0].definitions[0].example){
                example_p.innerText = el.meanings[0].definitions[0].example;
            }else{
                example_p.innerText = "Sorry, no example available";
            }

            container.appendChild(result);
        })
    }else{
        const error_msg = document.createElement("p");
        container.appendChild(error_msg);
        error_msg.classList.add("error_msg");
        error_msg.innerText = "Please enter a valid input.";
    }
}

search.addEventListener("click", async () => {
    let meaning = await getMeaning(URL+input.value);
    displayData(meaning);
    input.value = "";
});