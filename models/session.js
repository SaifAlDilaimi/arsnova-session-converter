const Question = require('./question.js')

class Session{
    constructor(session_json){
        this.session_json = session_json;
        this.parse(session_json);
    }

    parse(session_json){
        this.name = session_json.exportData.session.name;
        this.shortName = session_json.exportData.session.shortName;
        this.questions = this.generateQuestions(session_json.exportData.questions);
    }

    generateQuestions(questions_json){
        var questions = []

        var index;
        for(index = 0; index < questions_json.length; index++){
            var q = questions_json[index];
            var new_q = new Question(q.questionType,
                q.questionVariant, 
                q.subject, 
                q.text, 
                q.possibleAnswers, q.hint, q.solution, q.image);

            questions.push(new_q);
        }

        return questions;
    }
}

module.exports = Session;