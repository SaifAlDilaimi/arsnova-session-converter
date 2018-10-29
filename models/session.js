const Question = require('./question.js');
const QuestionParser = require('./questionparser');

class Session{

    constructor(name, shortName, questions){
        this.name = name;
        this.shortName = shortName;
        this.questions = questions;
    }

    async fromJson(sessionJson){
        const name = sessionJson.exportData.session.name;
        const shortName = sessionJson.exportData.session.shortName;
        const questionParser = new QuestionParser();
        const questions = await questionParser.parseQuestions(sessionJson);

        const session = new Session(name, shortName, questions);

        return session;
    }
}

module.exports = Session;