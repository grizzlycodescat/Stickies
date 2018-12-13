document.addEventListener('DOMContentLoaded', function(event){
	main();
})

function main() {
	'use strict';

	var draggedElement, onDragStart, onDrag, onDragEnd, xCoord, yCoord;

	//dragging movement

	onDragStart = function(ev) {
		var elementBoundingBox;

		draggedElement = this;

		elementBoundingBox = draggedElement.getBoundingClientRect();	
		yCoord = elementBoundingBox.top - ev.clientY; 
		xCoord = elementBoundingBox.left - ev.clientX;
	};


	onDrag = function(ev) {
		var posX = ev.clientX + xCoord;
		var posY = ev.clientY + yCoord;

		if(posX < 0) {
			posX = 0;
		}

		if(posY < 0) {
			posY = 0;
		}

		draggedElement.style.transform = "translateX(" + posX +"px) translateY(" + posY + "px)";
	};

	onDragEnd = function() {
		draggedElement = 0;
		xCoord = 0;
		yCoord = 0;
	}

	document.addEventListener('mousemove', onDrag, false);
	document.querySelector('.note-body').addEventListener('mousedown', onDragStart, false);
	document.addEventListener('mouseup', onDragEnd, false);


	//create, delete Notes

	var createNote, deleteNote, createNoteBtn, saveNote, loadNotes, getNoteObj, onAddNoteClick, filterNotes;

	getNoteObj = function(element) {
		var textArea = element.querySelector('textarea');
		var title = element.querySelector('input');
		console.log(textArea, title)
		return {
			title: title.value,
			content: textArea.value,
			id: element.id,
			position: element.style.transform,
		}
	}

	createNote = function(choice) {
		var noteBody = document.createElement('div');
		var titleBar = document.createElement('div');
		var noteTitleInput = document.createElement('input');
		var textArea = document.createElement('textarea');
		var buttonContainer = document.createElement('div');
		var saveNoteBtn = document.createElement('button');
		var deleteNoteBtn = document.createElement('button');
		var onSave, onDelete;
		var noteConfig = choice || {
			title: '',
			content: '',
			id: "note_" + new Date().getTime(),
			position: "translateX(" + Math.random() * 400 + "px) translateY(" + Math.random() * 400 + "px)"
		}
	
		onDelete = function() {
			deleteNote(
				getNoteObj(noteBody)
			);

			document.body.removeChild(noteBody)
		}

		onSave = function() {
			saveNote(
				getNoteObj(noteBody)
			);
		}

		//how values are displayed on load

		noteBody.id = noteConfig.id;
		textArea.value = noteConfig.content;
		noteTitleInput.value = noteConfig.title;

		saveNoteBtn.addEventListener('click',onSave);
		deleteNoteBtn.addEventListener('click',onDelete);
	
		noteBody.style.transform = noteConfig.position;
		noteBody.classList.add('note-body');
		titleBar.classList.add('title-bar');
		noteTitleInput.classList.add('note-title-input');
		buttonContainer.classList.add('button-container');
		saveNoteBtn.classList.add('save-button');
		deleteNoteBtn.classList.add('delete-button');

		titleBar.appendChild(noteTitleInput)
		noteBody.appendChild(titleBar);
		noteBody.appendChild(textArea);
		buttonContainer.appendChild(saveNoteBtn)
		buttonContainer.appendChild(deleteNoteBtn)
		noteBody.appendChild(buttonContainer);
		
		noteBody.addEventListener('mousedown', onDragStart, false);
		document.body.appendChild(noteBody);
	};

	onAddNoteClick = function() {
		createNote();
	}

	saveNote = function (note) {
		localStorage.setItem(note.id, JSON.stringify(note));
	};

	deleteNote = function(note) {
		localStorage.removeItem(note.id)
	};

	loadNotes = function() {
		for(var i = 0; i < localStorage.length; i++) {
			var noteObject = JSON.parse(
				localStorage.getItem(localStorage.key(i))
			);
			createNote(noteObject)
		}
	}

	var filterInput = document.getElementById('filter');
	filterInput.addEventListener('keyup', function(event){
		event.preventDefault();
		if(event.keyCode === 13) {
			var inputVal = filterInput.value;
			filterNotes(inputVal);
		}
	});

	filterNotes = function(filterVal) {
		for(var i = 0; i < localStorage.length; i++) {
			var obj = JSON.parse(localStorage.getItem(localStorage.key(i))
			);
			if(obj.title === filterVal) {
				var titleBar = document.getElementById(obj.id);
				titleBar.style.backgroundColor = '#E80CB3';

				setInterval(function() {
					titleBar.style.backgroundColor = '#FFFFFF'
				}, 2000)
			}
		}
	};

	loadNotes();


	createNoteBtn = document.querySelector('.createNoteButton');
	createNoteBtn.addEventListener('click',onAddNoteClick,false);
};