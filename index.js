idcount=0;
ridcount=0;
let selected;
function save()
{
    localStorage.setItem("qdata",JSON.stringify(arr));
}
function calculatetime(node)
{
    let curr=parseInt(Date.now());
    let sec=parseInt((curr-node.time)/1000);
    let s=sec%60;
    let min=parseInt(sec/60);
    let m=min%60;
    let hour=parseInt(min/60);
    let h=hour%24;
    let day=parseInt(hour/24);
    
    if(m==0){
        return s+" seconds ago";
    }
    else if(h==0 && min<60){
        return m+" minutes ago";
    }
    else if(day==0 && h<24)
        return h+" hours ago";
    else
        return day+" day ago";

}
function resolveClicked()
{
    let task=document.getElementById(arr[selected].id);
    parent=task.parentNode;
    parent.removeChild(task);
    arr.splice(selected,1);
    newQuestion();
    save();
}
function responseUpvoteClicked(event)
{
    let parent=event.target.parentNode.parentNode;

    for(let i=0;i<arr[selected].responseArr.length;i++)
    {
        if("r"+arr[selected].responseArr[i].id==parent.id)
        {
            arr[selected].responseArr[i].upvote++;
            event.target.innerText=" "+arr[selected].responseArr[i].upvote;
            save();
            break;
        }
    }

}
function responseDownvoteClicked(event)
{

    let parent=event.target.parentNode.parentNode;

    for(let i=0;i<arr[selected].responseArr.length;i++)
    {
        if("r"+arr[selected].responseArr[i].id==parent.id)
        {
            arr[selected].responseArr[i].downvote++;
            event.target.innerText=" "+arr[selected].responseArr[i].downvote;
            save();
            break;
        }
    }
}
function rfavclicked(event)
{

    let parent=event.target.parentNode.parentNode;
    for(let i=0;i<arr[selected].responseArr.length;i++)
    {
        if("r"+arr[selected].responseArr[i].id==parent.id)
        {
            if(arr[selected].responseArr[i].fav==false)
            {

                arr[selected].responseArr[i].fav=true;
                event.target.style.color="gold";


            }
            else{
                arr[selected].responseArr[i].fav=false;
                event.target.style.color="#ccc";
            }
            save();
            break;
        }
    }
}
function insertResponse(rnode)
{
    let response=document.createElement("div");
    

    let leftside=document.createElement("div");

    let name=document.createElement("h4");
    name.innerText=rnode.name;
 

    let comment=document.createElement("h6");
    comment.innerText=rnode.comment;

    let time=document.createElement("p");
    time.innerText=calculatetime(rnode);


    leftside.appendChild(name);
    leftside.appendChild(comment);
    leftside.appendChild(time);





    let rightside=document.createElement("div");
    rightside.style.display="flex";
    rightside.style.justifyContent="center";
    rightside.style.alignItems="center";

    let upvote=document.createElement("a");
    upvote.innerText=" "+rnode.upvote;
    upvote.setAttribute("class","fa-solid fa-thumbs-up icons");
    upvote.style.color="green";
    upvote.addEventListener("click",responseUpvoteClicked);

    let downvote=document.createElement("a");
    downvote.innerText=" "+rnode.downvote;
    downvote.setAttribute("class","fa-solid fa-thumbs-down icons");
    downvote.style.color="red";
    downvote.addEventListener("click",responseDownvoteClicked);
    


    let fav=document.createElement("i");
    fav.setAttribute("class","fa-solid fa-star icons");
    fav.addEventListener("click",rfavclicked);
    if(rnode.fav)
    {
        fav.setAttribute("id","f2");
        fav.style.color="gold";
    }
    else{
        fav.setAttribute("id","f1");
        fav.style.color="#ccc";
    }


    rightside.appendChild(upvote);
    rightside.appendChild(downvote);
    rightside.appendChild(fav);


    response.appendChild(leftside);
    response.appendChild(rightside);
    response.setAttribute("class","task");
    response.setAttribute("id","r"+rnode.id);

    document.getElementById("rtop").appendChild(response);


}
function createResponseNode()
{
    let n=document.getElementById("name");
    let c=document.getElementById("comment");
    let name=n.value;
    let comment=c.value;
    let flagname=0;
    for(let k=0;k<name.length;k++)
    {
        if(name[k]!=" ")
        {
            flagname=1;
            break;
        }
    }
    if(flagname==0)
    {
        n.value="";
        c.value="";
        alert("Please Enter Name");
        return null;
    }


    let flagcomment=0;
    for(let k=0;k<comment.length;k++)
    {
        if(comment[k]!=" ")
        {
            flagcomment=1;
            break;
        }
    }
    if(flagcomment==0)
    {
        n.value="";
        c.value="";
        alert("Please Enter Comment");
        return null;
    }

    n.value="";
    c.value="";


    ridcount++;
    let rnode={};
    rnode.id=ridcount;
    rnode.name=name;
    rnode.comment=comment;
    rnode.upvote=0;
    rnode.downvote=0;
    rnode.fav=false;
    rnode.time=parseInt(Date.now());
    return rnode;
}
function submitResponseClicked()
{

    let rnode=createResponseNode();
    if(rnode==null)
    {
        return;
    }
    arr[selected].responseArr.push(rnode);
    save();
    insertResponse(rnode);
}
function compare(x,y)
{
    if(x.upvote-x.downvote>y.upvote-y.downvote)
    {
        return -1;
    }
    else if(x.upvote-x.downvote<y.upvote-y.downvote)
    {
        return 1;
    }
    else{
        return 0;
    }
}
function openQuestion(target)
{
    let parent=document.getElementById("right");
    parent.innerHTML="";
    parent.setAttribute("responses","true");
    let i;

    
    for(i=0;i<arr.length;i++)
    {
        if(arr[i].id==target.id)
        {


            break;
        }
    }

    selected=i;
    arr[selected].responseArr.sort(compare);
    
    let main=document.createElement("div");

    let h=document.createElement("h2");
    h.innerText="Question:";
    
    let d=document.createElement("div");
    d.setAttribute("class","questionbox");
    let s=document.createElement("h2");
    s.innerText=arr[selected].subject;
    let q=document.createElement("h4");
    q.innerText=arr[selected].question;
    d.appendChild(s);
    d.appendChild(q);
    
    
    let btn=document.createElement("button");
    btn.innerText="Resolve";
    btn.setAttribute("class","btn bg-primary my-3");
    btn.style.float="right";
    btn.addEventListener("click",resolveClicked);

    main.appendChild(h);
    main.appendChild(d);
    main.appendChild(btn);
    main.style.margin="20px 0px 50px 0px";


    let responses=document.createElement("div");

    let r=document.createElement("h2");
    r.innerText="Responses:";
    responses.appendChild(r);

    let rtop=document.createElement("div");
    rtop.setAttribute("id","rtop");
    

    let rbottom=document.createElement("div");
    rbottom.style.padding="20px 0px";


    let h2=document.createElement("h4");
    h2.innerText="Add Responses";
    h2.setAttribute("id","h2");

    let name=document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("id","name");
    name.setAttribute("placeholder","Name");
    

    let comment=document.createElement("textarea");
    comment.setAttribute("id","comment");
    comment.setAttribute("placeholder","Comment");


    let submit=document.createElement("button");
    submit.innerText="Submit";
    submit.setAttribute("id","rsubmit");
    submit.setAttribute("class","btn bg-primary");
    submit.addEventListener("click",submitResponseClicked);
    submit.style.float="right";

    rbottom.appendChild(h2);
    rbottom.appendChild(name);
    rbottom.appendChild(comment);
    rbottom.appendChild(submit);
    // rbottom.style.color="white";

    responses.appendChild(rtop);
    responses.appendChild(rbottom);

    

    parent.appendChild(main);
    parent.appendChild(responses);



    selected=i;
    let mx=0;
    for(let j=0;j<arr[selected].responseArr.length;j++)
    {


        insertResponse(arr[selected].responseArr[j]);
        if(arr[selected].responseArr[j].id>mx)
        {
            mx=arr[selected].responseArr[j].id;
        }
        
    }
    ridcount=mx;







    


}

function taskclicked(target)
{
    console.log("task clicked");

    openQuestion(target);


}
function upvoteClicked(event)
{

    let parent=event.target.parentNode.parentNode;
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i].id==parent.id)
        {
            arr[i].upvote++;
            event.target.innerText=" "+arr[i].upvote;
            save();
            break;
        }
    }
}
function downvoteClicked(event)
{
    let parent=event.target.parentNode.parentNode;
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i].id==parent.id)
        {
            arr[i].downvote++;
            event.target.innerText=" "+arr[i].downvote;
            save();
            break;
        }
    }
}

function favClicked(event)
{
    let parent=event.target.parentNode.parentNode;
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i].id==parent.id)
        {
            if(arr[i].fav==false)
            {

                arr[i].fav=true;
                event.target.style.color="gold";


            }
            else{
                arr[i].fav=false;
                event.target.style.color="#ccc";
            }
            save();
            break;
        }
    }
    
}

function taskAreaClicked(event)
{


    let x=event.target.getAttribute("eltype");
    if(x=="upvote")
    {
        upvoteClicked(event);

    }
    else if(x=="downvote")
    {
        downvoteClicked(event);
    }
    else if(x=="fav")
    {
        favClicked(event);
    }
    else if(x=="subject" || x=="question" || x=="time")
    {
        taskclicked(event.target.parentNode.parentNode);
    }
    else if(x=="leftside" || x=="rightside")
    {
        taskclicked(event.target.parentNode);
    }
    else{
        taskclicked(event.target);
    }
}

function insert(node)
{

    let task=document.createElement("div");
    

    let leftside=document.createElement("div");
    leftside.setAttribute("eltype","leftside");

    let subject=document.createElement("h4");
    subject.innerText=node.subject;
    subject.setAttribute("eltype","subject");

    let question=document.createElement("h6");
    question.innerText=node.question;
    question.setAttribute("eltype","question");

    let time=document.createElement("p");
    time.innerText=calculatetime(node);
    time.setAttribute("eltype","time");

    leftside.appendChild(subject);
    leftside.appendChild(question);
    leftside.appendChild(time);





    let rightside=document.createElement("div");
    rightside.setAttribute("eltype","rightside");
    rightside.style.display="flex";
    rightside.style.justifyContent="center";
    rightside.style.alignItems="center";

    let upvote=document.createElement("a");
    upvote.innerText=" "+node.upvote;
    upvote.setAttribute("class","fa-solid fa-thumbs-up icons");
    upvote.style.color="green";
    upvote.setAttribute("eltype","upvote");

    let downvote=document.createElement("a");
    downvote.innerText=" "+node.downvote;
    downvote.setAttribute("class","fa-solid fa-thumbs-down icons");
    downvote.style.color="red";
    downvote.setAttribute("eltype","downvote");


    let fav=document.createElement("i");
    fav.setAttribute("class","fa-solid fa-star icons");
    fav.setAttribute("eltype","fav");
    if(node.fav)
    {
        fav.setAttribute("id","f2");
        fav.style.color="gold";
    }
    else{
        fav.setAttribute("id","f1");
        fav.style.color="#ccc";
    }


    rightside.appendChild(upvote);
    rightside.appendChild(downvote);
    rightside.appendChild(fav);


    task.appendChild(leftside);
    task.appendChild(rightside);
    task.setAttribute("class","task");
    task.setAttribute("eltype","task");
    task.setAttribute("id",node.id);
    task.addEventListener("click",taskAreaClicked);

    document.getElementById("leftbottom").appendChild(task);



}

function createNode()
{
    
    let s=document.getElementById("subject");
    let q=document.getElementById("question");
    let subject=s.value;
    let question=q.value;
    let flagsub=0;
    for(let k=0;k<subject.length;k++)
    {
        if(subject[k]!=" ")
        {
            flagsub=1;
            break;
        }
    }
    if(flagsub==0)
    {
        s.value="";
        q.value="";
        alert("Please Enter Subject");
        return null;
    }


    let flagque=0;
    for(let k=0;k<question.length;k++)
    {
        if(question[k]!=" ")
        {
            flagque=1;
            break;
        }
    }
    if(flagque==0)
    {
        s.value="";
        q.value="";
        alert("Please Enter Question");
        return null;
    }

    s.value="";
    q.value="";



    idcount++;
    let node={};
    node.id=idcount;
    node.subject=subject;
    node.question=question;
    node.upvote=0;
    node.downvote=0;
    node.fav=false;
    node.responseArr=[];
    node.time=parseInt(Date.now());
    
    return node;

}

function submitClicked()
{
    refreshLeft();

    console.log("submitclicked");
    let node=createNode();
    if(node==null)
    {
        return;
    }
    arr.push(node);
    insert(node);
    save();
}

function newQuestion(){
    refreshLeft();
    let parent=document.getElementById("right");
    parent.innerHTML="";
    parent.setAttribute("responses","false");
    
    



    let heading=document.createElement("h1");
    heading.innerText="Welcome to Discussion Portal!";
    heading.setAttribute("id","heading");

    let heading2=document.createElement("h4");
    heading2.innerText="Enter a subject and question to get started";
    heading2.setAttribute("id","heading2");

    let subject=document.createElement("input");
    subject.setAttribute("type","text");
    subject.setAttribute("id","subject");
    subject.setAttribute("placeholder","Subject");
    

    let question=document.createElement("textarea");
    question.setAttribute("id","question");
    question.setAttribute("placeholder","Question");


    let submit=document.createElement("button");
    submit.innerText="Submit";
    submit.setAttribute("id","submit");
    submit.addEventListener("click",submitClicked);

    parent.appendChild(heading);
    parent.appendChild(heading2);
    parent.appendChild(subject);
    parent.appendChild(question);
    parent.appendChild(submit);



}

function favouritesClicked()
{
    
    let f=document.getElementById("favourites");
    let v=f.getAttribute("clicked");
    if(v=="false")
    {
        document.getElementById("leftbottom").innerHTML="";
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i].fav)
            {
                insert(arr[i]);
            }
        }
        f.setAttribute("clicked","true");
        f.style.backgroundColor="gold";
    }
    else{
        
        f.setAttribute("clicked","false");
        f.style.backgroundColor="#ccc";
        reload();

    }
    
}
function refreshLeft()
{
    let f=document.getElementById("favourites");
    let v=f.getAttribute("clicked");
    if(v=="true")
    {
        f.setAttribute("clicked","false");
        f.style.backgroundColor="#ccc";
        reload();
    }
}


function reload()
{
    arr.sort(compare);
    document.getElementById("leftbottom").innerHTML="";
    for(let i=0;i<arr.length;i++)
    {
        insert(arr[i]);
    }
}


function searchQuestion(event)
{
    refreshLeft();



    document.getElementById("leftbottom").innerHTML="";
    let val=event.target.value.toLowerCase();;
    for(let i=0;i<arr.length;i++)
    {
        let s=arr[i].subject.toLowerCase();
        let q=arr[i].question.toLowerCase();
        if(s.includes(val) || q.includes(val))
        {
            insert(arr[i]);
        }
    }
}
function refreshTime()
{
    //tasks
    console.log("refreshed time");
    let tasks=document.getElementById("leftbottom").children;
    for(let i=0;i<tasks.length;i++)
    {
        let curr;
        for(let j=0;j<arr.length;j++)
        {
            if(tasks[i].id==arr[j].id)
            {
                curr=arr[j];
                break;
            }
        }
        tasks[i].children[0].children[2].innerText=calculatetime(curr);

    }

    //responses
    let parent=document.getElementById("right");
    let check=parent.getAttribute("responses");

    if(check=="true")
    {
        let p=document.getElementById("rtop");
        let resp=p.children;
        let respArr=arr[selected].responseArr;

        for(let i=0;i<resp.length;i++)
        {
            let curr;
            for(let j=0;j<respArr.length;j++)
            {

                if(resp[i].id=="r"+respArr[j].id)
                {

                    curr=respArr[j];
                    break;

                }
            }
            resp[i].children[0].children[2].innerText=calculatetime(curr);
        }


    }



}

let arr=[];
newQuestion();
document.getElementById("newquestion").addEventListener("click",newQuestion)
let f=document.getElementById("favourites");
f.addEventListener("click",favouritesClicked);
f.setAttribute("clicked","false");
f.style.backgroundColor="#ccc";

let search=document.getElementById("searchbox");
search.addEventListener("input",searchQuestion);




if(localStorage.getItem("qdata")==null)
{
    localStorage.setItem("qdata",JSON.stringify(arr));

}
else
{
    let x=localStorage.getItem("qdata");
    arr=JSON.parse(x);
    let mx=0;
    arr.sort(compare);
    for(let i=0;i<arr.length;i++)
    {
        insert(arr[i]);
        if(arr[i].id>mx)
        {
            mx=arr[i].id;
        }
    }
    idcount=mx;

}

// setTimeout(refreshTime,5000);
setInterval(refreshTime,1000);






















