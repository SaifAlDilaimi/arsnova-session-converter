const download = require('image-downloader')
const Question = require('./question')
const randomstring = require("randomstring");
const fse = require('fs-extra')
var https = require('https')

class QuestionParser {

    async parseQuestions(sessionJson) {

        var questionJson = sessionJson.exportData.questions;

        const imageDownloadPromises = questionJson
            .filter((questionRecord) => {
                const questionHasImageUrl = questionRecord.image != null;
                return questionHasImageUrl;
            })
            .map((questionRecord) => {
                const imageName = randomstring.generate()+".png";
                const destinationPath = `./tmp/${imageName}`;
                const imageDownloadOption = {
                    url: questionRecord.image,
                    dest: destinationPath,
                    imageName: imageName
                }
                questionRecord.imageName = imageName
                return imageDownloadOption;
            })
            .map((imageDownloadOption) => {
                const imagePromise = download.image(imageDownloadOption);

                return imagePromise;
            });

        const questions = questionJson.map((questionRecord) => {
            const question = new Question(
                questionRecord.type,
                questionRecord.questionVariant,
                questionRecord.subject,
                questionRecord.text,
                questionRecord.possibleAnswers,
                questionRecord.hint,
                questionRecord.solution,
                questionRecord.image,
                questionRecord.imageName
            );

            return question;
        });

        await Promise.all(imageDownloadPromises);

        return questions;
    }

}

module.exports = QuestionParser;