const fs=require("fs");
const path=require("path");
var pathobj=path.parse(__dirname);
//sconsole.log(path);
console.log(pathobj);
var os=require("os");
var t=os.totalmem();
var m=os.freemem();
console.log("total memory="+t +"free memory="+m+os.type());
const files=fs.readdir("./",function(err,files)
{
    if(err)
     console.log("error");
     else
     console.log(files);
});
console.log(files);