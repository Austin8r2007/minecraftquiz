var test = {
  name: "Minecraft Test",
  description: "This is a Minecraft test, you will be timed come on minecraft",
  passCutoff: 90,
  applyNegativeMarking: false,
  time: 60,
  questions: [
    {
    no: "1",
    qtext:"How tall is a enderman?",
    options:[
      {text:"Three"},
      {text:"Five"},
      {text:"Four"},
      {text:"Eight"}
    ],
    ans:"Four",
    marks: 1
  },
  {
    no: "2",
    qtext:"How many blocks is a nether portal?",
    options:[
      {text:"15"},
      {text:"14"},
      {text:"10"}
    ],
    ans:"10",
    marks: 1
  },
  {
    no: "3",
    qtext:"What is the main character's name?",
    options:[
      {text:"Bob"},
      {text:"Joe"},
      {text:"Steve"},
      {text:"Linda"}
    ],
    ans:"Steve",
    marks: 1
  },
  {
    no: "4",
    qtext:"Are villages in the plains?",
    options:[
      {text:"yes"},
      {text:"no"}
    ],
    ans:"yes",
    marks: 1
  },
  ]
};

  var QuestionPaper = React.createClass({
		getInitialState: function() {
			return {totalscore : 0, timeElapsed: this.props.timeAllotted};
		},
		handleChange: function(score) {
			this.setState({totalscore: this.state.totalscore + score});
		},
		handleSubmitted: function(event) {
			var result = {totalscore: this.state.totalscore};
			this.props.onSubmitted( result );
			clearInterval(this.interval);
		},
		tick: function() {
      if( this.state.timeElapsed > 0 ) {
        this.setState({timeElapsed: ((this.state.timeElapsed - 1))});
        this.props.onTimeChange( this.state.timeElapsed );
      } else {
        var result = {totalscore: this.state.totalscore};
			  this.props.onSubmitted( result );
      }
    },
    componentDidMount: function() {
      this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
		render: function(){
			var questionAnswers = this.props.questions.map(function(question){
				return(
					<tr><td><Question question={question.qtext} number={question.no} options={question.options} answer={question.ans} marks={question.marks} applyNegativeMarking={this.props.applyNegativeMarking} onAnswered={this.handleChange}/></td></tr>
					);
			}, this);
			return(
				<div>
					<table className="table table-striped">{questionAnswers}</table>
					<div><input type="button" className="btn btn-primary" value="Submit" onClick={this.handleSubmitted}/></div>
				</div>

			);
		}
	});

	var Question = React.createClass({
		getInitialState: function() {
			return {
				correctAnswerRecorded: false,
				negativeAnswerRecorded: false
			};
		},
		handleChange: function(event) {
			var score = 0;
			if( event.target.value == this.props.answer) {
				if( this.state.correctAnswerRecorded === false ) {
					if( this.props.applyNegativeMarking === true && this.state.negativeAnswerRecorded === true ) {
						score = 1 + this.props.marks;
					} else {
						score = this.props.marks;
					}
				}
				this.state.correctAnswerRecorded = true;
				this.state.negativeAnswerRecorded = false;
			} else {
				if( this.props.applyNegativeMarking === true && this.state.negativeAnswerRecorded === false ) {
					if( this.state.correctAnswerRecorded === true ) {
						score = -1 - this.props.marks;
					} else {
						score = -1;
					}

				} else {
					if( this.state.correctAnswerRecorded === true ) {
						score = -this.props.marks;
					}
				}
				this.state.negativeAnswerRecorded = true;
				this.state.correctAnswerRecorded = false;
			}
			this.props.onAnswered(score);
		},
		render: function(){
			var qname = "option" + this.props.number;
			var qoptions = this.props.options.map(function(option){
			return (
				<div><input type="radio" name={qname} value={option.text} onChange={this.handleChange}/>&nbsp;{option.text}</div>
				);
			}, this);
			return(
				<div>
					<div><strong>Q</strong>: {this.props.question}</div>
					<div>{qoptions}</div>
					<br/>
				</div>
			);
		}
	});

	var Scorecard = React.createClass({
		render: function(){
			var status = "Test not submitted!";
			if( this.props.testSubmitted == true ) {
				if( this.props.percentage < this.props.passRate ) {
					status = "Sorry, you could not pass the test. Try again later!"
				} else {
					status = "Congratulations!! You passed the test.";
				}
			}
			return(
				<div className="list-group">
					<div className="list-group-item active">Test Result</div>
					<div className="list-group-item">Score: <strong>{this.props.score}</strong></div>
					<div className="list-group-item">Percentage: <strong>{this.props.percentage}&nbsp;%</strong></div>
					<div className="list-group-item">Status: <strong>{status}</strong></div>
				</div>
			);
		}
	});

	var Stopwatch = React.createClass({
	  render: function() {
	    return (
	        <div className="list-group">
					<div className="list-group-item active">Time Left (In Seconds)</div>
					<div className="list-group-item"><h1>{this.props.timeElapsed}</h1></div>
				</div>
	      );
	  }
	});

	var Test = React.createClass({
		getInitialState: function() {
			return {totalscore : 0, testSubmitted: false, timeElapsed: this.props.details.time};
		},
		handleChange: function(result) {
			this.setState({totalscore: result.totalscore, testSubmitted: true});
		},
		handleStopwatch: function( timeElapsed ) {
		  this.setState({timeElapsed: timeElapsed});
		},
		render: function(){
			var totalmarks = 0;
			this.props.details.questions.map(function(question){
				totalmarks += question.marks;
			});
			return(
				<div>
					<h1>{this.props.details.name}</h1>
					<hr className="divider"/>
					<div>{this.props.details.description}</div>
					<table className="table">
						<tr>
							<td className="col-md-9">
							<QuestionPaper questions={this.props.details.questions} applyNegativeMarking={this.props.details.applyNegativeMarking}
							 onSubmitted={this.handleChange} onTimeChange={this.handleStopwatch} timeAllotted={this.props.details.time} />
							 </td>
							 <td className="col-md-3">
							  <Stopwatch timeElapsed={this.state.timeElapsed} />
							  <Scorecard score={this.state.totalscore} testSubmitted={this.state.testSubmitted} percentage={Math.round(this.state.totalscore*100/totalmarks)} passRate={this.props.details.passCutoff}/>
							</td>
						</tr>
					</table>
				</div>
			);
		}
	});

  var HomeButton = React.createClass({
    getInitialState: function(){
      this.setState({navigateTo: this.props.page});
      return {navigateTo:this.props.page};
    },
    goHome: function (){
      location.href=this.state.navigateTo;
    },
	  render: function() {
	    return (
	        <div><input type="button" className="btn btn-primary" value={this.props.text} onClick={this.goHome} /></div>
	      );
	  }
	});
