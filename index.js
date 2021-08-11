const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extented: true}));
booky.use(bodyParser.json());


/*
Route    /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Methods       GET

*/
booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
Route    /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     ISBN
Methods       GET

*/
booky.get("/is/:isbn",(req,res) =>{
      const getSpecificBook = database.books.filter(
          (book) => book.ISBN === req.params.isbn
      );

      if(getSpecificBook.length === 0) {
          return res.json({error:`No book found for the ISBN of ${req.params.isbn}`});
      }
      return res.json({book:getSpecificBook});
});
/*
Route         /c
Description   Get specific book on category
Access        PUBLIC
Parameter     category
Methods       GET

*/
booky.get("/c/:category",(req,res) => {
   const getSpecificBook = database.books.filter(
       (book) => book.category.includes(req.params.category)
   )

   if(getSpecificBook.length === 0) {
       return res.json({error:`No book found for the category of ${req.params.category}`});
   }
   return res.json({book: getSpecificBook});
});
/*
Route         /l
Description   Get specific book on language
Access        PUBLIC
Parameter     language
Methods       GET
*/
booky.get("/l/:language",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    )
    if(getSpecificBook.length === 0){
        return res.json({error:`No books found for the category of  ${req.params.language}`});
    }
    return res.json({book:getSpecificBook});
});
/*
Route         /author
Description   Get all authors
Access        PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/author",(req,res) =>{
    return res.json({authors: database.author});

});
/*
Route         /author/book
Description   Get all authors based on books
Access        PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/author/book/:isbn",(req,res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No author found for the book of ${req.params.isbn}`
        });
    }
    return res.json({authors: getSpecificAuthor});
});
/*
Route         /publications
Description   Get all publications
Access        PUBLIC
Parameter     NONE
Methods       GET
*/
booky.get("/publications",(req,res) =>{
    return res.json({publications: database.publication});
});
/*
Route         /publications/book
Description   Get all publications
Access        PUBLIC
Parameter     ISBN
Methods       GET
*/
booky.get("/publication/book/:isbn",(req,res) =>{
    const getSpecificPublication= database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No Publication found for the book of ${req.params.isbn}`
        });
    }
    return res.json({publications: getSpecificPublication});
});
/*
Route         /publications/id
Description   Get publications for specific id
Access        PUBLIC
Parameter     ISBN
Methods       GET
*/
booky.get("/publication/id/:id",(req,res) =>{
    const getSpecificPublication= database.publication.filter(
        (publication) => publication.id === req.params.id
    );
    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No Publication found for the book of ${req.params.id}`
        });
    }
    return res.json({publications: getSpecificPublication});
});

//POST method starts
/*
Route         /book/new
Description   add new books
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});
/*
Route         /author/new
Description   add new authors
Access        PUBLIC
Parameter     NONE
Methods       POST
*/
booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});
/*
Route         /publication/new
Description   add new publications
Access        PUBLIC
Parameter     NONE
Methods       POST
*/
booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
});
/*
Route         /publication/update/book
Description   update/add new publication
Access        PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn",(req,res) =>{
    //update the publication database
    database.publication.forEach((pub) =>{
        if(pub.id === parseInt(req.body.pubId)) {
            return pub.books.push(req.params.isbn);
        }

    });
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId; //assuming one publication eack book
            return;
        }
    });
    //return json
    return res.json({
        books: database.books,
        publications: database.publication,
        message:"Successfully updated publication"
    });
});

/****Delete****/
/*
Route         /book/delete
Description   Delete a book from the book and the author
Access        PUBLIC
Parameter     isbn ,authorId
Methods       Delete
*/

booky.delete("/book/delete/:isbn",(req,res) =>{
  //which ever book that doesnot match with the isbn,just send it to the ubdatedbookDatabase array
  //and rest will be filtered out
  const updatedBookDatabase = database.books.filter(
      (book) =>book.ISBN !==req.params.isbn
  )
  database.books = updatedBookDatabase;
  return res.json({updatedBooks: database.books});
});//working on site, not on postman
/*
// Route                             /book/delete/author
// Description                       delete author from book
// Access                            PUBLIC
// Parameter                         ID
// Methods                           Delete
// */
 
booky.delete("/book/delete/author/:id", (req,res)=>{
     
    database.books.forEach((book)=>{
        if(book.ISBN = req.body.ISBN){
           const updatedBookDatabase = book.author.filter(
               (eachAuthor) => eachAuthor!== parseInt(req.params.id)
           )
        book.author = updatedBookDatabase;
        return;
        }
    })
       
    return res.json({UpdatedBooks: database.books})
})
 
// /*
// Route                             /book/delete/author
// Description                       delete author from book and related book from author
// Access                            PUBLIC
// Parameter                         ID And ISBN
// Methods                           Delete
// */

booky.delete("/book/delete/author/:isbn/:authorId",(req,res) =>{
  //update the book database
  database.books.forEach((book)=>{
      if(book.ISBN === req.params.isbn) {
          const newAuthorList = book.author.filter(
              (eachAuthor) => eachAuthor !==parseInt(req.params.authorId)
          );
          book.author = newAuthorList;
          return;
      }
  });

  //update the author database
  database.author.forEach((eachAuthor) =>{
      if (eachAuthor.id=== parseInt(req.params.id)){
        const bookList = eachAuthor.books.filter(
            (book)=>book !== req.params.isbn
        )
        eachAuthor.books = bookList
        return;
    }
});

return res.json({
    Books: database.books,
    Authors: database.author,
    message: "UPDATED"
});

});


booky.listen(3000,() => {
    console.log("Server is up and running");
});