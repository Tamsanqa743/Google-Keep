class Note{
    constructor(id,title, text){
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App{
    constructor(){
        this.notes = [];
    }

    addNote({title, text}){
        const id = 2;//Date.now();
        const newNote = new Note(id,title, text);
        this.notes  = [...this.notes, newNote];
    }

    editNote(id, {title, text}){
        this.notes.map(note =>{
            if (note.id == id){
                note.title = title;
                note.text = text;
            }
        })
    }

    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id != id);
      }

    
      displayNotes() {
        this.notes.map((note) =>
          console.log(`
        ID: ${note.id}
        Title: ${note.title}
        Text: ${note.text}
        `)
        );
      }
}

const note1 = {
    title: "Test note",
    text:"text"
}

const app = new App();
app.addNote(note1);
