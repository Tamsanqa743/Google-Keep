class Note{
    constructor(id,title, text){
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App{
    constructor(){
        // this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        // [new Note("hello", "test title", "test text")];
        this.notes = [];
        this.selectedNoteId = "";
        this.miniSidebar = true;
        this.userId = "";
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
        this.$closeModalForm = document.querySelector("#modal-btn")
        this.$sidebar = document.querySelector(".sidebar");
        this.$sidebarActiveItem = document.querySelector(".active-item");
        this.$app = document.querySelector("#app");
        this.$firebaseAuthContainer = document.querySelector("#firebaseui-auth-container");
        this.$app.style.display = "none";
        this.$authUserText = document.querySelector(".auth-user");
        this.$logoutButton = document.querySelector(".logout");

        // Initialize the FirebaseUI Widget using Firebase.
       this.ui = new firebaseui.auth.AuthUI(auth);
       this.handleAuth();
       this.addEventListeners();
    }

    handleAuth(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.userId = String(user.uid);
              this.redirectToApp();
              this.$authUserText.innerHTML = user.displayName;
            } else {
              // User is signed out
              this.redirectToAuth();
              // ...
            }
          });
      
    }

    handleSignOut(){
        firebase.auth().signOut().then(()=>{
            this.redirectToAuth();

        }).catch((error)=>{
            console.log("ERROR OCCURED", error);
        });
    }

    redirectToApp(){
        this.$firebaseAuthContainer.style.display = "none";
        this.$app.style.display = "block";
        this.fetchNotes();

    }

    redirectToAuth(){
        this.$firebaseAuthContainer.style.display = "block";
        this.$app.style.display = "none";
        this.ui.start('#firebaseui-auth-container', {
            callbacks: {
               
                signInSuccessWithAuthResult:(authResult, redirectUrl)=>{
                    //user successfully signed in
                    this.userId = authResult.user.uid;
                    this.$authUserText.innerHTML = user.displayName;
                    this.redirectToApp();
                }
            },
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ], // Other config options...
        }); 
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

        this.$modalForm.addEventListener("submit", (event)=>{
            event.preventDefault();
        })

        this.$sidebar.addEventListener("mouseover", (event)=>{
            this.handleToggleSidebar();
        })
        this.$sidebar.addEventListener("mouseout", (event)=>{
            this.handleToggleSidebar();
            
        })

        this.$logoutButton.addEventListener("click", (event)=>{
            console.log("before");
            this.handleSignOut();
            console.log("after");
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
            const newNote = {id:cuid(),title, text};
            this.notes  = [...this.notes, newNote];
            this.render();
        }
    }

    editNote(id, {title, text}){
        this.notes.map(note =>{
            if (note.id == id){
                note.title = title;
                note.text = text;
            }
        })
        this.render()
    }

    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id != id);
        this.render();
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

    handleToggleSidebar(){
        if(this.miniSidebar){
            this.$sidebar.style.width = "250px";
            this.$sidebar.classList.add("sidebar-hover");
            this.$sidebarActiveItem.classList.add("sidebar-active-item");
            this.miniSidebar = false;

        }
        else{
            this.$sidebar.style.width = "80px";
            this.$sidebar.classList.remove("sidebar-hover");
            this.$sidebarActiveItem.classList.remove("sidebar-active-item");
            this.miniSidebar = true;
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
        const isCloseModalBtn = this.$closeModalForm.contains(event.target);
        if ((!isModalFormClickedOn || isCloseModalBtn) && this.$modal.classList.contains("open-modal")){
            this.editNote(this.selectedNoteId, {title:this.$modalTitle.value, text: this.$modalText.value})
            this.$modal.classList.remove("open-modal");
        }
    }

        saveNotes(){
            db.collection("users").doc(this.userId).set({
            notes:this.notes
            })
            .then(()=>{
                console.log("Document successfully written!");
            })
            .catch((error) =>{
                console.log("Error writting document: ", error);
            });
        }


        fetchNotes(){
            const docRef = db.collection("users").doc(this.userId);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    this.notes = doc.data().notes;
                    this.displayNotes();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    db.collection("users").doc(this.userId).set({
                        notes:[]
                        })
                        .then(()=>{
                            console.log("User successfully created!");
                        })
                        .catch((error) =>{
                            console.log("Error writting document: ", error);
                        });
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }

        render(){
            this.saveNotes();
            this.displayNotes();
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
