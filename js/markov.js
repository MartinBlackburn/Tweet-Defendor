Markov = function(chosenWord)
{

    //List of url for source text
    var mobyDick = "text/mobyDick.txt";

	//ebooks array
	var ebookList = [mobyDick];
    var finalSourceText = "";

    //Array of all the words
    var wordArray;

    //Array of words that can appear on screen
    var wordBuffer = [];

    //final sentence
    var finalSentence = "";

    loadEbooks();

    //Loop through the ebook array and load each ebook
    function loadEbooks()
    {
        console.log("LoadEbook");

        //Loop through the ebookList and load each ebook
        for(var i = 0; i < ebookList.length; i++)
        {
            console.log("loading: " + ebookList[i]);
            $.ajax({
                url: ebookList[i],
                crossDomain: true,
                success: createSourceText,
                error: function(xhr, error, text2){ console.log(xhr); console.log(error); console.log(text2); }
            });
        }
    }

    function createSourceText(data)
    {
        console.log("createSourceText");

        finalSourceText = finalSourceText + "/n/n" + data;

        wordArray = finalSourceText.split(/\s+/g);

        stripWords();

        if(chosenWord)
        {
            genNextWords();
        }
        else
        {
            randomStartWords();
        }
    }

    //Strip punctuation from words in word array
    function stripWords()
    {
        for(var i = 0; i < wordArray.length; i++)
        {
            wordArray[i] = wordArray[i].replace(/\b[-.,;:()&$#!?\[\]{}"']+\B|\B[-.,;:()&$#!?\[\]{}"']+\b/g, "").toLocaleLowerCase();
        }
    }

	//get random words, for first set of words
    function randomStartWords()
    {
        console.log("RandomWords");

        for(var i = 0; i < 50; i++)
        {
            var randomNum = Math.ceil(Math.random()*wordArray.length);

            wordBuffer.push( wordArray[randomNum]);
        }

        console.log(wordBuffer);
    }

    //get next words base on the word passed in
    function genNextWords()
    {
        console.log("genNextWords");
        wordBuffer = [];

        for(var i = 0; i < wordArray.length; i++)
        {
            if(wordArray[i] == chosenWord)
            {
                wordBuffer.push(wordArray[i+1]);
            }
        }

        console.log(wordBuffer);
    }

    Markov.prototype.getRandomWord = function()
    {
        console.log("getRandomWord#");
        return wordBuffer[Math.floor(Math.random()*wordBuffer.length)];
    }
};

$(function() 
{
    new Markov();
});