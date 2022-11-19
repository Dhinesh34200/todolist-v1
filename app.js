const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const { urlencoded } = require("body-parser");
const _=require("lodash");

const app=express();


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-dhinesh:X4uxxTXPmqOnfdfY@cluster0.ozip6k2.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemsSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemsSchema);

const work=new Item({
    name:"Work"
});
const gym=new Item({
    name:"gym"
});
const food=new Item({
    name:"food"
});

let defaultItems=[work,gym,food];

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});

const List=mongoose.model("List",listSchema);





app.get("/",function(req,res){
    
    Item.find({},(err,founditem)=>{
        if (founditem.length === 0) {
            Item.insertMany([work, gym, food], function (err) {
                if (!err) {
                    console.log("todo list added!")
                } 
            });
            res.redirect("/");

        }
        else{
            res.render("list",{kindOfDay:"today",newtodoItem:founditem});
        }              
    })
    
});

app.get("/:customListName",function(req,res){
    
    const listTitle=_.capitalize(req.params.customListName.trim());
    List.findOne({name:listTitle},function(err,foundListItem){
        
            if (!foundListItem) {
                //create list
                console.log("list creating")
                const list=new List({
                    name:listTitle,
                    items:defaultItems
                });

                list.save(()=>{
                    res.redirect("/"+listTitle);
                });
                    
                
                
                
            } else{
                //show list
                res.render("list",{kindOfDay:foundListItem.name,newtodoItem:foundListItem.items});
            }          
        
    });
    
    
});


app.get("/about",(req,res)=>{
    res.render("about");
});

app.post("/",function(req,res){
    var itemName=req.body.newItem;
    var listName=req.body.button.trim();
    const newItem= new Item({
        name:itemName
    });
    if(listName==="today"){ 
        console.log("post today")     
        newItem.save();
        res.redirect("/");
    }else{
        console.log("post custom")
        List.findOne({name:listName},function(err,founditem){
            console.log(founditem);
                          
                founditem.items.push(newItem);
                founditem.save();
                res.redirect("/"+listName);
            
        });
    }   
});

app.post("/delete",function(req,res){ 
    const itemID=req.body.checkbox;
    const name=req.body.listName.trim();  
    console.log(name);
    console.log(itemID);

    if(name == "today")// but here it is failing
    { 
        console.log("today in")
        Item.deleteOne({_id:itemID},function(err){
            if(!err){
                console.log(itemID+" deleted!");
                res.redirect("/");
            }
        });
    }
    
    else{
        List.findOneAndUpdate({name:name},
            {$pull:{items:{_id:itemID}}},
            function(err,foundlist){
                if(!err){
                    res.redirect("/"+name);
                }
            });
        
    }   
});

// app.post("/work",function(req,res){
//     var item=req.body.newItem;
    
//     items.push(item);
//     res.redirect("/work");
// })

let port=process.env.PORT;
if(port == null || port== ""){
    port= 3000;
}


app.listen(port,function(){
    console.log("server has started succesfully");
})


// while(listname === "Today"){
//     console.log("today in")
//     Item.deleteOne({_id:itemID},function(err){
//         if(!err){
//             console.log(itemID+" deleted!");
//             listname="joy"
//             res.redirect("/");
//         }
//     });
// }