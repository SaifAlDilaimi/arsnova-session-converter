const Question = require('./question.js')
const ImageDownloader = require('./imagedownloader')

class Session{
    constructor(){
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
            
            if(q.imageURL != null){
                var options = {
                    url: q.imageURL,
                    dest: './tmp/'+q.imageName
                }

                new ImageDownloader().download(options)
            }
            questions.push(new_q);
        }

        return questions;
    }
}

module.exports = Session;