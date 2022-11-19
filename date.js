module.exports={date:getdate,day:getday};

function getdate(){
    let today=new Date();      
    const option={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return today.toLocaleDateString("en-US",option);
    
}

function getday(){
    let today=new Date();      
    const option={ weekday: 'long'};
    return today.toLocaleDateString("en-US",option);
    
}

