$(inicio);

function inicio() {

	$data.Entity.extend('$todo.Types.ToDoEntry', {
		Id : {
			type : 'int',
			key : true,
			computed : true
		},
		Value : {
			type : 'string'
		},
		Date : {
			type : 'datetime'
		}
	});

	$data.EntityContext.extend('$todo.Types.ToDoContext', {
		TodoEntries : {
			type : $data.EntitySet,
			elementType : $todo.Types.ToDoEntry
		}
	});

	$todo.context = new $todo.Types.ToDoContext({
		name : 'webSql',
		databaseName : 'todo'
	});

	$todo.context.onReady(function() {
		actualizarVista();
	});

	//Añadimos el listener para el boton
	$('#btnAdd').click(function() {
		crearTarea();
	});

}

function crearTarea() {
	var value = $('#input_task').val();
	if (!value)
		return;
	var now = new Date();

	var entity = new $todo.Types.ToDoEntry({
		Value : value,
		Date : now
	});
	$todo.context.TodoEntries.add(entity);
	$todo.context.saveChanges(actualizarVista);
}

function actualizarVista() {
	//ocultamos la lista
	$("#lista-tareas").fadeOut("slow", function() {
		//cuando termine de ocultarla, borramos su contenido
		$("#lista-tareas").html('');
		//llamamos a la funcion para recorrerlas
		listaTareas();
		//y volvemos a mostrar
		$("#lista-tareas").fadeIn();
	});

}

function listaTareas() {
	$todo.context.TodoEntries.forEach(function(item) {
		imprimeTarea(item);
	}).then(function() {
		$("#lista-tareas").trigger("create");
	});
}

function imprimeTarea(item) {
	var etiqueta = document.createElement('label');
	etiqueta.htmlFor = item.Id;
	etiqueta.innerHTML = item.Value;

	var check = document.createElement('input');
	check.type = "checkbox";
	check.id = item.Id;
	check.name = "done";
	check.onchange = function() {
		eliminarTarea(this.id);
	}
	$("#lista-tareas").append(etiqueta);
	$("#lista-tareas").append(check);

}

function eliminarTarea(id) {
	var entry = new $todo.Types.ToDoEntry({
		Id : id
	});
	$todo.context.TodoEntries.remove(entry);
	$todo.context.saveChanges().then(function() {
		actualizarVista();
	});
}
