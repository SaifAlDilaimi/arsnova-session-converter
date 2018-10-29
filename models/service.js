const download = require('image-downloader');

const Session = require('./session');
const LaTeXDoc = require('./latexdoc');

class ConvertionService {
    
    async exportLaTeXDocuments(sessionJson) {

        var session = await new Session().fromJson(sessionJson);
        var texDoc = new LaTeXDoc(session);
        const pdfName = texDoc.save();

        return pdfName;
    }

}

module.exports = ConvertionService;