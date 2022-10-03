const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const csv = require('csv-parser')
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
const fs = require("fs")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvbookWriter = createCsvWriter({
  path: 'public/links/books.csv',
  header: [
    { id: 'title', title: 'title' },
    { id: 'isbn', title: 'isbn' },
    { id: 'authors', title: 'authors' },
    { id: 'description', title: 'description' }
  ]
});

const csvauthorWriter = createCsvWriter({
  path: 'public/links/authors.csv',
  header: [
    { id: 'email', title: 'email' },
    { id: 'firstname', title: 'firstname' },
    { id: 'lastname', title: 'lastname' },
  ]
})


const csvmagazineWriter = createCsvWriter({
  path: 'public/links/magazines.csv',
  header: [
    { id: 'title', title: 'title' },
    { id: 'isbn', title: 'isbn' },
    { id: 'authors', title: 'authors' },
    { id: 'publishedAt', title: 'publishedAt' }
  ]
});



const books = readcsv('public/links/books.csv')
const authors = readcsv('public/links/authors.csv')
const magazines = readcsv('public/links/magazines.csv')

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/magazines", (req, res) => {
  res.render("magazines", { mag: magazines, authors: authors })
})

app.get("/books", (req, res) => {
  res.render("books", { books: books, authors: authors })
})

app.post("/findbooks", (req, res) => {
  const search = req.body.search;
  for (let i = 0; i < books.length; i++) {
    if (search == books[i].isbn) {
      res.render("searchresult", { result: books[i], authors: authors })
    }
  }

  for (let i = 0; i < magazines.length; i++) {
    if (search == magazines[i].isbn) {
      res.render("searchresult", { result: magazines[i], authors: authors })
    }
  }

  res.redirect("/")

})

app.post("/findemail", (req, res) => {
  const searchemail = req.body.searchemail;
  for (let i = 0; i < books.length; i++) {
    if (searchemail == books[i].authors) {
      var bookres = books[i]
    }
  }

  for (let i = 0; i < magazines.length; i++) {
    if (searchemail == magazines[i].authors) {
      var magres = magazines[i]
    }
  }

  res.render("emailresult", { result: bookres, authors: authors, result2: magres })
})

app.get("/addbook", (req, res) => {
  res.render("addbook")
})

app.post("/addbook", (req, res) => {
  let records = []
  let records2 = []
  const title = req.body.title
  const isbn = req.body.isbn
  const authoremail = req.body.authoremail
  const desc = req.body.desc

  const firstname = req.body.authorfname
  const lastname = req.body.authorlname

  records = [
    { title: title, isbn: isbn, authors: authoremail, description: desc },
  ];

  records2 = [
    { email: authoremail, firstname: firstname, lastname: lastname }
  ]

  fs.createReadStream('public/links/books.csv')
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', () => {
      csvbookWriter.writeRecords(records)
        .then(() => {
          console.log('...Done');
        });
    })

  fs.createReadStream('public/links/authors.csv')
    .pipe(csv())
    .on('data', (data) => records2.push(data))
    .on('end', () => {
      csvauthorWriter.writeRecords(records2)
        .then(() => {
          console.log('...Done');
        });
    })


  res.redirect("/")

})


app.get("/addmagazine", (req, res) => {
  res.render("addmagazine")
})

app.post("/addmagazine", (req, res) => {
  let records = []
  let records2 = []
  const title = req.body.title
  const isbn = req.body.isbn
  const authoremail = req.body.authoremail
  const date = req.body.date

  const firstname = req.body.authorfname
  const lastname = req.body.authorlname

  records = [
    { title: title, isbn: isbn, authors: authoremail, publishedAt: date },
  ];

  records2 = [
    { email: authoremail, firstname: firstname, lastname: lastname }
  ]

  fs.createReadStream('public/links/magazines.csv')
    .pipe(csv())
    .on('data', (data) => records.push(data))
    .on('end', () => {
      csvmagazineWriter.writeRecords(records)
        .then(() => {
          console.log('...Done');
        });
    })

  fs.createReadStream('public/links/authors.csv')
    .pipe(csv())
    .on('data', (data) => records2.push(data))
    .on('end', () => {
      csvauthorWriter.writeRecords(records2)
        .then(() => {
          console.log('...Done');
        });
    })


  res.redirect("/")

})

app.get("/magazinesraw", (req, res) => {
  res.send(magazines)
})


app.get("/booksraw", (req, res) => {
  res.send(books)
})
function readcsv(url) {
  const results = [];
  fs.createReadStream(url)
    .pipe(csv())
    .on('data', (data) => results.push(data))
  return results
}


app.listen(process.env.PORT || 3000, () => console.log("Server started at port 3000"))