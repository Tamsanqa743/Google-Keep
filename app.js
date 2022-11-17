class Note{
    constructor(id,title, text){
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App{
    constructor(){
        this.notes = [new Note("hello", "test title", "test text")];
        this.selectedNoteId = "";
        this.$activeForm = document.querySelector(".active-form");
        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$notes = document.querySelector(".notes");
        this.$form = document.querySelector("#form");
        this.$modal = document.querySelector(".modal");
        this.$modalForm = document.querySelector("#modal-form");
        this.$modalTitle = document.querySelector("#modal-title");
        this.$modalText = document.querySelector("#modal-text");

        this.addEventListeners();
        this.displayNotes();
    }

    addEventListeners(){
        document.body.addEventListener("click", (event) =>{
            this.handleFormClick(event);
            this.closeModal(event);
            this.openModal(event);
            this.handleAchiving(event);
            
        })

        this.$form.addEventListener("submit", (event)=>{
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.addNote({title, text});
            this.closeActiveForm();
        })
    }

    handleFormClick(event){
        const isActiveForm = this.$activeForm.contains(event.target);
        const isInactiveForm = this.$inactiveForm.contains(event.target);
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
       
        if(isInactiveForm){
            this.openActiveForm();
        }
        else if(!isInactiveForm && !isActiveForm){

        this.addNote({title, text});
            this.closeActiveForm();
        }

    }

    openActiveForm(){
        this.$inactiveForm.style.display = "none";
        this.$activeForm.style.display = "block";
        this.$noteText.focus();
    }
   

    closeActiveForm(){
        this.$inactiveForm.style.display = "block";
        this.$activeForm.style.display = "none";
        this.$noteText.value = "";
        this.$noteTitle.value = "";
    }

    addNote({title, text}){
        if (text != ""){
            const newNote = new Note(cuid(),title, text);
            this.notes  = [...this.notes, newNote];
            this.displayNotes();
        }
    }

    editNote(id, {title, text}){
        this.notes.map(note =>{
            if (note.id == id){
                note.title = title;
                note.text = text;
            }
        })
        this.displayNotes()
    }

    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id != id);
        this.displayNotes();
      }

    handleMouseOverNote(element){
        const $note = document.querySelector("#"+element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");

        $checkNote.style.visibility = "visible";
        $noteFooter.style.visibility = "visible";
    }

    handleMouseOutNote(element){
        const $note = document.querySelector("#"+element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");

        $checkNote.style.visibility = "hidden";
        $noteFooter.style.visibility = "hidden";
    }
    handleAchiving(event){
        const $selectedNote = event.target.closest(".note");
        if($selectedNote && event.target.closest(".archive")){
            this.selectedNoteId = $selectedNote.id;
            this.deleteNote(this.selectedNoteId);
        }
        else{
            return;
        }
    }

    openModal(event){
        const $selectedNote = event.target.closest(".note");
        if($selectedNote && !event.target.closest(".archive")){
            this.selectedNoteId = $selectedNote.id;
            this.$modalTitle.value = $selectedNote.children[1].innerHTML;
            this.$modalText.value = $selectedNote.children[2].innerHTML;
            this.$modal.classList.add("open-modal");
        }
    }

    closeModal(event){

        const isModalFormClickedOn = this.$modalForm.contains(event.target);
        if (!isModalFormClickedOn && this.$modal.classList.contains("open-modal")){
            this.editNote(this.selectedNoteId, {title:this.$modalTitle.value, text: this.$modalText.value})
            this.$modal.classList.remove("open-modal");
        }
    }

    
      displayNotes() {
        this.$notes.innerHTML = this.notes.map((note) =>
          `
          <div class="note" id="${note.id}" onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)">
                <span class="material-icons check-circle">check_circle</span>
                <div class="title">${note.title}</div>
                <div class="text">${note.text}</div>
                <div class="note-footer">
                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">add_alert</span>
                        <span class="tooltip-text">Remind me</span>
                    </div>

                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">person_add</span>
                        <span class="tooltip-text">Collaborator</span>
                    </div>

                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">palette</span>
                        <span class="tooltip-text">Background options</span>
                    </div>
                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">check_box</span>
                        <span class="tooltip-text">New List</span>
                    </div>
                      
                    <div class="tootip archive">
                        <span class="material-symbols-outlined hover small-icon">archive</span>
                        <span class="tooltip-text">Archive</span>
                    </div>

                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">more_vert</span>
                        <span class="tooltip-text">More</span>
                    </div>

                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">undo</span>
                        <span class="tooltip-text">Undo</span>
                    </div>

                    <div class="tootip">
                        <span class="material-symbols-outlined hover small-icon">redo</span>
                        <span class="tooltip-text">Redo</span>
                    </div>
                </div>
                </div>
        `).join("");
      }
}

const app = new App(); 
