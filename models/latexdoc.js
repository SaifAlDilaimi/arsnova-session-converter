const fse = require('fs-extra');
const execSync = require('child_process').execSync;

class LaTeXDoc{

    constructor(session){

        this.session = session;

        this.doc = "\\documentclass[12pt]{article}"+
                "\\usepackage[T1]{fontenc}"+
                "\\usepackage[utf8]{inputenc}"+
                "\\usepackage{amsmath}"+
                "\\usepackage{float}"+
                "\\usepackage{graphicx}"+
                "\\usepackage{enumitem,amssymb}"+
                //"\\newcommand{\\quotedblbase}{\"}"+
                "\\newlist{todolist}{itemize}{2}"+
                "\\setlist[todolist]{label=$\\square$}"+
                "\\usepackage{titlesec}"+
                "\\titleformat*{\\section}{\\large\\bfseries}"+
                "\\titleformat*{\\subsection}{\\normal\\bfseries}"+
                "\\title{"+this.session.name+"}"+
                "\\begin{document}"+
                "\\maketitle";

        var i_q;
        for(i_q = 0; i_q < this.session.questions.length; i_q++){
            var q = this.session.questions[i_q];
            this.doc += "\\section{"+q.subject+"}"
            this.doc += "\\textbf{"+q.text+"}"

            q.downloadOptions.map((option) => {
                this.doc += "\\begin{figure}[H]"
                this.doc += "\\centering"
                this.doc += "\\includegraphics[width=8cm]{"+option.destinationPath+"}"
                this.doc += "\\end{figure}"
            });

            if (q.hint != null && q.hint != ""){
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
        const currentTime = Date.now();
        const texDocOutputPath = "./tmp/"+currentTime+".tex";
        const pdfName = currentTime+".pdf";
        const pdfOutputPath = "./tmp/"+pdfName;

        fse.outputFileSync(texDocOutputPath, this.doc);
        
        var cmd = '/net/vmits0310/disc1/texlive/2018/bin/x86_64-linux/pdflatex -interaction=nonstopmode -output-directory=./tmp/ '+texDocOutputPath;
        try {
            execSync(cmd, {shell: '/usr/bin/bash', stdio:[0,1,2]});
        } catch (err) {
            err.stdout;
            err.stderr;
            err.pid;
            err.signal;
            err.status;
            // etc
        }

        return pdfName;
    }
}

module.exports = LaTeXDoc;
