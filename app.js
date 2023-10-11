const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')


const app = express();

let items = ["Buy Food", "Eat food" ]; //When we use single variable then it's value gets overwritten and only one item can be added.
let workItems = [ ]

//Using EJS as view engine.
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get('/',function(req,res)
{
    let currentDay = date();
    
    res.render('list', { listTitle : currentDay, newListItems : items})
    // render looks inside the view folder, so it is a must to create views folder.

})

app.get("/work", function(req,res)
{
    res.render("list", { listTitle: "WorkList", newListItems: workItems})

    })

app.get("/about", function(req,res)
{
    res.render("about")
})



app.post("/",function(req,res)
{
    // console.log(req.body) Used to view the items added.
   let  item = req.body.NewItem
    if (req.body.list === "WorkList")
    {
        workItems.push(item)
        res.redirect("/work")
    } else {
    items.push(item)
    res.redirect("/")
    }
})

// app.post("/work",function(req,res)
// {
//     item = req.body.NewItem
//     workItems.push(item)
//     res.redirect("/work")
// })

app.listen(3000, function()
{
    console.log("Server listening on port 3000.")
})