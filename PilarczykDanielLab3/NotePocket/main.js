let notes = [];
let noteBoard = document.getElementById("noteBoard"); 
if(localStorage.getItem("notesObject")===null){             
    localStorage.setItem('notesObject', JSON.stringify(notes));
}

document.addEventListener( "DOMContentLoaded", () => {      
    let form = document.getElementById( "form" );
    form.addEventListener( "submit", function( e ) {
        e.preventDefault();
        let json = ToJSON( this );
    }, false);
});

var lsObject = localStorage.getItem('notesObject'); 
notes = JSON.parse(lsObject);
RenderNotes();

function RenderNotes() {         
    noteBoard.innerHTML = "";
    let id = 0;
    notes.forEach(element => {       
        var important = "false";
        if (element.important == 1) {
            important = "true";
        }

        var note = `
        <div class="note ${element.color}" id="${id++}">
            <div class="noteHeader">${element.header}</div>   
            <div class="noteContent">${element.content}</div>
            <footer class="noteFooter">
                ${element.date}
            <input type="checkbox" checked="${important}" disabled="true">
            </footer > 
        </div>
        `;

        noteBoard.innerHTML = noteBoard.innerHTML + note;                               
    });
}

function ToJSON( form ) {           
    let object = {};
    object["header"] = form.header.value;
    object["content"] = form.content.value;

    if (form.important.checked == true) {
        value = 1;
    }
    else { value = 0; }
    object["important"] = value;
    object["color"] = form.parentNode.className.split(' ')[1];
    object["date"] = Date.now();
    notes.push(object)                                            
    localStorage.setItem('notesObject', JSON.stringify(notes));
    RenderNotes();                                               
}

function ChangeColor(e){                                    
    let parent = e.parentNode.parentNode.parentNode.parentNode;
    parent.className = "newNote";
    parent.classList.add(e.className);
}