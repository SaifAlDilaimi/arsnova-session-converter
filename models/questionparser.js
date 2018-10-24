const download = require('image-downloader')
const Question = require('./question')
const randomstring = require("randomstring");
const fse = require('fs-extra')
var https = require('https')

class QuestionParser {

    async parseQuestions(sessionJson) {

        const questionJson = sessionJson.exportData.questions;

        const imageDownloadPromises = questionJson
            .filter((questionRecord) => {
                const questionHasImageUrl = questionRecord.imageURL != null;

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

                console.log(imageDownloadOption);

                return imageDownloadOption;
            })
            .map((imageDownloadOption) => {
                var response = https.get(imageDownloadOption.url);
                var file = fse.createWriteStream(imageDownloadOption.destinationPath);
                response.pipe(file);

                console.log(response);

                var imagePromise = new Promise((resolve, reject) => {
                    response.on('end', () => {
                      resolve()
                    })
                
                    response.on('error', () => {
                      reject()
                    })
                })                
                /*const imagePromise = download.image(imageDownloadOption);*/
                console.log("image: "+imagePromise);

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
                questionRecord.image
            );

            return question;
        });

        await Promise.all(imageDownloadPromises);

        return questions;
    }

}

module.exports = QuestionParser;