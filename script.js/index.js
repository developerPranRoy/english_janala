
const url = "https://openapi.programming-hero.com/api/levels/all"

const manageLoading = (status) => {

    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("word-container").classList.add("hidden")
    } else {
        document.getElementById("word-container").classList.remove("hidden")
        document.getElementById("spinner").classList.add("hidden")
    }
}
const dispalyLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `

        <div class="text-center col-span-full  text-gray-400 space-y-6 py-10 font-bangla">
            <img class="mx-auto" src="/assets/alert-error.png" alt="">
            <p class="text-xl  font-medium">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h3 class="font-semibold text-3xl text-gray-800">নেক্সট Lesson এ যান</h3>
        </div>
        `;
        manageLoading(false);
        return;
    }
    words.forEach((word) => {
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4 ">
            <h1 class="font-bold text-xl">${word.word ? word.word : "Not found"}</h1>
            <p class=" ">Meaning/Pronunciation</p>
            <div class="font-bangla text-2xl font-semibold">"${word.meaning ? word.meaning : "Meaning not found"} / ${word.pronunciation ? word.pronunciation : "Not found"} "</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] "><i class="fa-solid fa-circle-info"></i></button>

                <button onclick="pronounceWord('${word.word}')" class="btn hover:bg-[#1A91FF80] "><i class="fa-solid fa-volume-high"></i></button>
            </div>

        </div>


        `
        wordContainer.append(wordCard);
        manageLoading(false);

    });

}
const createElement = (arr) => {
    const elements = arr.map((element) => `<span class="btn">${element}</span> `);
    return elements.join(" ");
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const Response = await fetch(url);
    const details = await Response.json();
    // console.log(details);
    displayWorddetails(details.data);

}

const displayWorddetails = (word) => {
    const wordDetailsContainer = document.getElementById("word-details-container");

    wordDetailsContainer.innerHTML = `
      <div class="">
                 <h2 class="text-2xl font-bold"> ${word.word} (<i class="fa-solid fa-microphone "></i>
                  ${word.pronunciation})</h2>
                 </div>
                 <div class="">
                 <h2 class="text-xl font-bold"> ${word.meaning}</h2>
                 <p>Bangla</p>
                 </div>
                <div class="">
                 <h3 class="text-xl font-bold"> ${word.sentence}</h3>
               
                </div>
                <div class="">
                 <h2 class="text-xl font-bold"> Synonyms</h2>
                    <div class="btn">${createElement(word.synonyms)} </div>
                    </div>
    `;
    document.getElementById("wordModal").showModal();


}
const loadLessons = async () => {
    const Response = await fetch(url);
    const data = await Response.json();
    dispalyLevel(data.data);
}

const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn");
    // console.log(lessonBtn);
    lessonBtns.forEach(btn => btn.classList.remove("active"));
}
const loadLevelWord = async (id) => {
    manageLoading(true);
    const wordURL = `https://openapi.programming-hero.com/api/level/${id}`;
    const res = await fetch(wordURL);
    const data = await res.json();
    removeActive();
    const clickbtn = document.getElementById(`btn-lesson-${id}`);
    clickbtn.classList.add("active")
    dispalyLevelWord(data.data);

}

const dispalyLevel = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    for (const lesson of lessons) {
        const btndiv = document.createElement("div");
        btndiv.innerHTML = `
         <button id="btn-lesson-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i>
                Lesson- ${lesson.level_no}
            </button>

        `
        levelContainer.append(btndiv);

    }


}
loadLessons();

document.getElementById("input-search").addEventListener("input", () => {
    const inputSearch = document.getElementById("input-search");
    const searchValue = inputSearch.value.trim().toLowerCase();
    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            // console.log(filterWords)
            dispalyLevelWord(filterWords);
        })
})

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

