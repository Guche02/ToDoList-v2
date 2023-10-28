const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')

const app = express();

//Using EJS as view engine.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// connecting to database, creates a database if not present.
// localhost doesn't work with me.
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true }).then(function () {
    console.log("Sucessfully connected")
}).catch(function (error) {
    console.log(error)
})

//declaring a schema
const itemsSchema = {
    name: String
};

//creating a model, here the item inside model is the collection name and it is changes into plural implicitly.
const Item = mongoose.model("Item", itemsSchema)

// creating a document
const item1 = new Item({
    name: " Welcome to your todoList. "
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// for a customList made by user
const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

let currentDay = date();

app.get('/', function (req, res) {

    // reading from the database.
    // find doesn't accept a callback function anymore.
    Item.find({}).then(function (founditems) {
        // insert the data only if the list is empty
        if (founditems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully inserted items")
            }).catch(function (error) {
                console.log(error)
            })
            res.redirect("/")
        } else {
            res.render('list', { listTitle: currentDay, newListItems: founditems })
        }
        // render looks inside the view folder, so it is a must to create views folder.
    });
})

// express dynamic routing.
app.get("/:customlistName", function (req, res) {
    const customlistName = req.params.customlistName;

    // doesn't accept a callback anymore.
    List.findOne({ name: customlistName })
        .then(function (result) {
            if (result) {
                res.render("list", { listTitle: result.name, newListItems: result.items })
            } else {
                const list = new List({
                    name: customlistName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customlistName);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the query
            console.error(error);
        });


})

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "WorkList", newListItems: workItems })
// })

app.get("/about", function (req, res) {
    res.render("about")
})

app.post("/", function (req, res) {
    const itemName = req.body.NewItem;
    const listName = req.body.listTitle;

    const item = new Item({
        name: itemName
    })
    // To update the list.
    if (listName === currentDay) {
        item.save()
        res.redirect("/")
    } else {
        // I tried using updateOne but it didn't work, so used findOne.
        List.findOne({ name: listName }).then(function (result) {
            result.items.push(item);
            result.save();
            res.redirect("/" + listName)
        }).catch(function (error) {
            console.log(error);
        })
    }

})

// onclick function cannot be used, as we need to post the data in order to delete it from the database on the server side.
app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if( listName === currentDay){
        Item.findByIdAndRemove(checkedItem).then(function () {
            console.log("Successfully deleted!")
            res.redirect("/")
        }).catch(function (error) {
            console.log(error)
        }) 
    } else {
        // to traverse through the array present inside the documents.
        // first field specifies the condition, second field is used to pull the items matching the id of checkedItem
        List.findOneAndUpdate({name: listName},{ $pull: {items: {_id: checkedItem}}}).then(function(result){
          res.redirect("/"+ listName)
        }).catch(function(error){
            console.log(error)
        })
    }

})

app.listen(3000, function () {
    console.log("Server listening on port 3000.")
})

