function checkPassword(){
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    console.log(" Password:", password1,'\n',"Confirm Password:",password2);
    console.log("inside");
    let message = document.getElementById("message");

    if(password1.length != 0){
        if(password1 == password2){
            message.textContent = "Passwords match";
            message.style.backgroundColor = "#1dcd59";
            document.getElementById("message").style.display = "block";
            return true
        }
        else{
            message.textContent = "Password don't match";
            message.style.backgroundColor = "#ff4d4d";
            document.getElementById("message").style.display = "block";
            return false
        }
    }
    else{
        alert("Password can't be empty!");
        message.textContent = "";
        document.getElementById("message").style.display = "block";
        return false
    }
}

function foo(param1)
{
    let message = document.getElementById("message");
    document.getElementById("message").style.display = "none"; 
    console.log("myVar:",param1)
    if(param1.fo=="Username exists")
    {
        message.textContent = "UserID exists";
        message.style.backgroundColor = "#ff4d4d";   
        document.getElementById("message").style.display = "block"; 
        param1.fo="";
    }

}

function deleteCard(param1)
{
    if(param1)
    {
       var x= document.getElementById("cardD");
       x.style.display = "block";
    }
    else
    {
       var x=document.getElementById("cardD");
       x.style.display = "none"; 
    }
}