
document.querySelector("input[type=text]").addEventListener("focusin", () => { inputFocus(event.target, true) })
document.querySelector("input[type=text]").addEventListener("focusout", () => { inputFocus(event.target, false) })
const focuser = document.querySelector("form label span");
function inputFocus(a, b) {
    b ? focuser.classList.add("goUp") :
        a.value == "" ? focuser.classList.remove("goUp") : null;
}




function todoConsturct(arg1, arg2, arg3) {
    return `
        <label>
            <input type="checkbox" ${arg1 ? "checked" : ""} />
            <div>${arg2}</div>
            <button>delete task</button>
        </label>
    `
}


function drawer(arg) {
    let content = "";
    arg.forEach((it, id) => {
        content += todoConsturct(it.comp, it.descr)
    })
    root.innerHTML = content
    document.querySelectorAll("#root input[type=checkbox]")
        .forEach((inp, ind) => {
            inp.addEventListener("change", () => {
                // const changed = arg.
                // drawer(changed)
                handleTodo("completed",[ind,inp.checked]);
            })
        })
    document.querySelectorAll("#root button")
        .forEach((butt, ind) => {
            butt.addEventListener("click", () => {
                // const deleted = arg.
                // drawer(deleted)
                handleTodo("deleted",ind)
            })
        })
}

function app() {
    fetch("../data.json").then(res => res.json())
    .then((data) => {    
        if (Array.isArray(data) && data.length > 0) {
            drawer(data)
        } else {
            root.innerHTML = `
                <h1 style="color: red;">No Todos Task</h1>
            `
        }
    })
    .catch(() => {
        root.innerHTML = `
                <h1 style="color: red;">No Todos Task</h1>
            `
    })
}
app();

const inpVal = document.querySelector("input[type=text]");
document.querySelector("form").addEventListener("submit",(evt)=>{
    evt.preventDefault();
    const taskIt = inpVal.value;
    fetch("/addTask",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({"key": taskIt})
    }).then(resp=>resp.text())
        .then((answ)=>{
            console.log(answ);
            app()
        })


    inpVal.value = ""
})


function handleTodo(say,arg){
    fetch("/"+say,{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({"compKey": arg})
    }).then(res=>res.text())
        .then(answ=>app())
        .catch(()=>{
            alert("dangerous")
        });
}