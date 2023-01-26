const game = document.querySelector('#game')
const loading = document.querySelector("#loading")
const scoreDisplay = document.querySelector('#score')

let score = 0
const genres = [
    {
        name: 'Film',
        id: 11
    },
    {
        name: 'Books',
        id: 10
    },
    {
        name: 'Music',
        id: 12
    },
    {
        name: 'Video Games',
        id: 15
    }
]
const levels = ["easy", "medium", "hard"]
function addGenre(genre) {
    const column = document.createElement("div")
    column.classList.add("genre-column")
    column.innerHTML = genre.name
    game.append(column)

    levels.forEach(level => {
        const card = document.createElement("div")
        card.classList.add("card", "card-clickable")
        column.append(card)

        if (level === "easy") {
            card.innerHTML = "$100"
            card.setAttribute('data-value', 100)
        }
        if (level === "medium") {
            card.innerHTML = "$200"
            card.setAttribute('data-value', 200)
        }
        if (level === "hard") {
            card.innerHTML = "$300"
            card.setAttribute('data-value', 300)
        }
        fetch(`https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`).
        then(response => response.json()).
            then((data) => {
                card.setAttribute('data-question', data.results[0].question)
            card.setAttribute('data-answer', data.results[0].correct_answer)
        })
        setTimeout( () => {
            card.addEventListener("click", flipCard)
            loading.innerHTML = ""
        }, 3000)

    })
}

function flipCard() {
    this.style.fontSize = "14px";
    this.style.color ="white";
    this.innerHTML = "";
    const textDisplay = document.createElement("div")
    const answerBox = document.createElement("div")
    const trueButton = document.createElement("button")
    const falseButton = document.createElement("button")
    trueButton.classList.add("button")
    falseButton.classList.add("button")
    trueButton.innerHTML = "True"
    falseButton.innerHTML = "False"
    textDisplay.innerHTML = this.getAttribute("data-question")
    answerBox.append(trueButton, falseButton)
    this.append(textDisplay, answerBox)
    trueButton.addEventListener('click', getResult)
    falseButton.addEventListener('click', getResult)

    const allCards = Array.from(document.querySelectorAll(".card-clickable"))
    allCards.forEach(card => card.removeEventListener('click', flipCard))
}

function getResult() {
    const allCards = Array.from(document.querySelectorAll(".card-clickable"))
    allCards.forEach(card => card.addEventListener("click", flipCard))
    const cardOfButton = this.parentElement.parentElement
    if(cardOfButton.getAttribute('data-answer') === this.innerHTML) {
        score = score + parseInt(cardOfButton.getAttribute("data-value"))
        scoreDisplay.innerHTML = "$ " + score
        cardOfButton.classList.add('correct-answer')
        setTimeout(() => {
            while (cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild)
            }
            }, 100)
    } else {
        cardOfButton.classList.add("wrong-answer")
        setTimeout(() => {
            while (cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild)
            }
            cardOfButton.innerHTML= ""
        }, 100)
    }
    cardOfButton.removeEventListener("click", flipCard)
    cardOfButton.classList.remove("card-clickable")
}

genres.forEach(genre => addGenre(genre))