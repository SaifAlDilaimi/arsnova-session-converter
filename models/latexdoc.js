const fse = require('fs-extra');
var execSync = require('child_process').execSync;

class LaTeXDoc{
    constructor(session){
        this.session = session;
        this.doc = "\\documentclass[12pt]{article}"+
                "\\usepackage[utf8]{inputenc}"+
                "\\usepackage{amsmath}"+
                "\\usepackage{graphicx}"+
                "\\usepackage{enumitem,amssymb}"+
                "\\newlist{todolist}{itemize}{2}"+
                "\\setlist[todolist]{label=$\\square$}"+
                "\\usepackage{titlesec}"+
                "\\titleformat*{\\section}{\\large\\bfseries}"+
                "\\titleformat*{\\subsection}{\\normal\\bfseries}"+
                "\\title{"+this.session.name+"}"+
                "\\begin{document}"+
                "\\maketitle";
        this.generateDoc();
        this.save();
    }

    generateDoc(){
        var i_q;
        for(i_q = 0; i_q < this.session.questions.length; i_q++){
            var q = this.session.questions[i_q];
            this.doc += "\\section{"+q.subject+"}"
            this.doc += "\\textbf{"+q.text+"}"

            if (q.imageURL != null){
                this.doc += "\\begin{figure}[h!]"
                this.doc += "\\centering"
                this.doc += "\\includegraphics[width=1]{./tmp/"+q.imageName+"}"
                this.doc += "\\end{figure}"
            }

            if (q.hint != null){
                this.doc += "\\newline"
                this.doc += "\\newline" 
                this.doc += "\\textbf{Hinweis: } "+q.hint
            }
            this.doc += "\\begin{todolist}"

            var i_a;
            for(i_a = 0; i_a < q.possibleAnswers.length; i_a++){
                var a = q.possibleAnswers[i_a]
                this.doc += "\\item{"+a.text+"}"
            }
            this.doc += "\\end{todolist}"
        }
    }

    save(){
        this.doc += "\\end{document}";
        var datetimestamp = Date.now();
        this.path_tex = "./tmp/"+datetimestamp+".tex";
        this.path_pdf = "./tmp/"+datetimestamp+".pdf";
        this.pdf_name = datetimestamp+".pdf";
        fse.outputFileSync(this.path_tex, this.doc);
        
        var cmd = 'pdflatex -interaction=nonstopmode -output-directory=./tmp/ '+this.path_tex;
        try {
            execSync(cmd, {stdio:[0,1,2]});
        } catch (err) {
            err.stdout;
            err.stderr;
            err.pid;
            err.signal;
            err.status;
            // etc
        }
    }
}

module.exports = LaTeXDoc;