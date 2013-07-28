TweetDefendor = function() 
{
    //variables
    var finalSentence = "";
    var gameboardHeight = 0;
    var player = $(".player");

    //List of url for source text
    var mobyDick = "text/mobyDick.txt";
    var frankenstein = "text/frankenstein.txt";
    var alice = "text/alice.txt";

    //ebooks array
    var ebookList = [mobyDick, alice, frankenstein];
    var finalSourceText = "";

    //Array of all the words
    var wordArray;

    //Array of words that can appear on screen
    var wordBuffer = [];

    //chosen word
    var chosenWord = null;
    
    //final sentence
    var finalSentence = "";

    var booksLoaded = 0;
    
    resizeGameBoard();
    
    //listener for screen resize
	$(window).resize(function() {
		resizeGameBoard();
	});
	
	//make the player follow the mouse (start when mouse is over it)
	$(".gameBoard").on("mousemove", function(event) {
		if(event.offsetY < gameboardHeight - player.height()) {
		    player.css({
		       top: event.offsetY
		    });
		}
	});
    
    //resize gameboard
    function resizeGameBoard()
    {
    	gameboardHeight = $(window).height() - $(".header").outerHeight() - $(".footer").outerHeight() - 100;
    	$(".gameBoard").css("height", gameboardHeight + "px");
    }
    
    
    //clear screen of words
    function clearScreen()
    {
    	
    }

    /*==============================================================
                        Stuff for Morkov chain
    ==============================================================*/

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

    //Combine all the ebooks, once they are all loaded strip punctuation and generate the starting words.
    function createSourceText(data)
    {
        console.log("createSourceText");

        booksLoaded++;

        finalSourceText = finalSourceText + "/n/n" + data;

        if(booksLoaded == ebookList.length)
        {
            //Seperate all of the words and put them into an array
            wordArray = finalSourceText.split(/\s+/g);

            stripWords();
        
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
    }

    function getRandomWord()
    {
        console.log("getRandomWord");
        return wordBuffer[Math.floor(Math.random()*wordBuffer.length)];
    }
    
    function setWord(word)
    {
        chosenWord = word;
        
        genNextWords();
    }
};

$(function() 
{
    new TweetDefendor();
});