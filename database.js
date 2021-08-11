const books = [
    {
        ISBN: "1234Book",
        title: "Tesla!!!",
        pubDate: "2021-08-05",
        language: "en",
        numPage: 250,
        author: [1,2],
        publications: [1],
        category: ["tech","space","education"],
        id : 1234
    }
]

const author = [
    {
        id: 1,
        names: "Anu",
        books: ["1234Book","secretBook"]
    },
    {
        id: 2,
        names: "Poorani",
        books: ["1234Book","HarryPotter"]

    }
]
const publication = [
    {
        id: "1",
        names: "Noody",
        books: ["4567Book","secretBook"]
    }
    ,
    {
        id:"2",
        names: "Smart",
        books: ["1234Book","MyBook"]
    },
    {
        id:"3",
        names: "NeverMind",
        books: []
    }
]

module.exports = {books,author,publication};