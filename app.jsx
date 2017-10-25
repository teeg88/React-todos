let todos = [
	{ 
		task : "Example task 1", 
		taskId : 1,
		complete : false
	}, 
	{ 
		task : "Example task 2",
		taskId : 2,
		complete : false
	},
	{ 
		task : "Example task 3", 
		taskId : 3,
		complete : false
	}, 
];


let nextTaskId = 4;

let ListItem = React.createClass({

	propTypes : {
		task : React.PropTypes.string.isRequired,
		onTaskEdit : React.PropTypes.func.isRequired 
	},

	getInitialState : function(){
		return {
			task: this.props.task,
			edit : false,
			complete : this.props.complete,
		}
	},

	onClick : function(e) {
		this.setState({
			edit : true,
		})
	},

	onChange : function(e){
		this.setState({
			task : e.target.value,
		})
	},

	enterPress : function(event) {
		if(event.key == 'Enter'){
			event.target.blur();
			document.getElementById('addTaskInput').focus();
		}
	},

	onBlur : function(){
		this.props.onTaskEdit(this.state.task, this.props.index)
		this.setState({
			edit : false,
		});
	},

	completeTask : function(){
		if (this.state.complete){
			this.setState({
				complete : false
			}, function(){
				this.props.onComplete(this.state.complete, this.props.index);
			});
		} else {
			this.setState({
				complete : true
			}, function(){
				this.props.onComplete(this.state.complete, this.props.index);
			});
		}
	},

	deleteTask : function(index){
		this.props.onDeleteTask(this.props.index);
	},

	render : function(){

		let editMode = <input className="edit-task" onKeyPress={this.enterPress} autoFocus={true} type="text" value={this.state.task} onBlur={this.onBlur} onChange={this.onChange}/>;
		let labelMode = <li className={(this.state.complete ? "complete" : null)} onClick={this.onClick}>{this.state.task}</li> ;
		
		return 	(
			<div className="task-list">
				<div className="task">
					{(this.state.edit ? editMode : labelMode)}
				</div>
				<div className="task-buttons">
					<button className="btn-complete" onClick={this.completeTask}>Complete</button>
					<button className="btn-delete" onClick={this.deleteTask}>Delete</button>	
				</div>		
			</div>
		);
	}

});

let Counter = React.createClass({
		
	render : function(){
		if (this.props.toDo > 0){
			if(this.props.toComplete == 0){
				return (
					<h5>You have completed all of your tasks!</h5>
				);
			} else {
				return (
					<h5>Tasks to complete:<span> {this.props.toComplete}</span></h5>
				);
			}
		} else {
			return (
				<h5>Please enter a task!</h5>
			);
		}
	}
	
});
	

let AddTask = React.createClass({
	
	getInitialState : function(){
		return {
			text: "",
		}
	},

	onChange : function(e){
		this.setState({
			text : e.target.value
		})
	},

	onSubmit : function(e){
		e.preventDefault();
		if (this.state.text == ""){
			alert('Todo cannot be empty');
		} else {
			this.props.onAdd(this.state.text);
			this.state.text = "";
		}
	},
	
	render : function(){
		return (
			<div className="add-task">
				<form onSubmit={this.onSubmit}>
					<input id="addTaskInput" required={true} type="text" value={this.state.text} onChange={this.onChange} placeholder="Type something that needs doing..."/>
					<input type="submit" value="Add"/>
				</form>
			</div>
		);
	}
});

function Instruction(props){
	if (props.count > 0){
		return (<h5>Click a task to edit...</h5>);
	} else return (null);
}

let Application = React.createClass({

	propTypes : {
		title : React.PropTypes.string,
		todos : React.PropTypes.array.isRequired
	},

	getInitialState : function(){
		return {
			todos : this.props.todos
		}
	},

	getDefaultProps : function(){
		return {
			title : "A Todo List App",
		}
	},

	onComplete : function(complete, taskIndex){
		this.state.todos.map(function(item, index){
			if (taskIndex == index){
				 item.complete = complete;
			}
		})
		this.setState(this.state);
	},

	onTaskAdd : function(task){
		this.state.todos.push({
			task : task,
			taskId : nextTaskId,
			complete : false,
		});
		nextTaskId++;
		this.setState(this.state);
	},

	onTaskEdit : function(task, taskIndex){
		this.state.todos.map(function(item, index){
			if (taskIndex == index){
				return item.task = task;
			}
		})
		this.setState(this.state);		
	},

	onDeleteTask : function(index){
		this.state.todos.splice(index, 1);
		this.setState(this.state);
	},

	getComplete : function (){
		let complete = [];
		this.state.todos.map(function(item){
			if (item.complete){
				complete.push(item);
			}
		})
		return this.state.todos.length - complete.length;		
	},

	render : function(){
		return (
			<div>
				<h1>{this.props.title}</h1>
				<Instruction count={this.state.todos.length} />
				{this.state.todos.map(function(item, index){
					return <ListItem 
								index={index} 
								complete={item.complete} 
								onComplete={this.onComplete} 
								task={item.task} 
								key={item.taskId} 
								onTaskEdit={this.onTaskEdit}
								onDeleteTask={this.onDeleteTask}/>
				}.bind(this))}
				<AddTask onAdd={this.onTaskAdd}/>
				<Counter toDo={this.state.todos.length} toComplete={this.getComplete()}/>
			</div>
		);
	}
});

ReactDOM.render(<Application todos={todos}/>, document.getElementById('container'));

