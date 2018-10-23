class Answer{
    constructor(id, text, correct, value){
        this.id = id;
        this.text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        this.correct = correct;
        this.value = value
    }
}

module.exports = Answer;