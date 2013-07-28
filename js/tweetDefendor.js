TweetDefendor = function() 
{
    //variables
	var gameBoard = $(".gameBoard").first();
    var finalSentence = "";
    var gameboardHeight = 0;
    var player = $(".player");
    var wordInterval = 1000;
    var wordSpeed = 30;
    
    //word timers
    var timer;
    var moveWordsTimer;
	moveWords();

    //List of url for source text
    var mobyDick = "text/mobyDick.txt";
    var frankenstein = "text/frankenstein.txt";
    var alice = "text/alice.txt";
    var pridePred = "text/pridePred.txt";
    var huckFinn = "text/huckFinn.txt";
    var wuthHeight = "text/wuthHeights.txt";
    var peterPan = "text/peterPan.txt";
    var beingEarn = "text/beingEarn.txt";
    var twoCities = "text/twoCities.txt";
    var littleBro = "text/littleBro.txt";
    var ftw = "text/ftw.txt";
    var printCrime = "text/printCrime.txt";
    var sysAdmin = "text/sysAdmin.txt";
    var iRobot = "text/iRobot.txt";

    //ebooks array
    var ebookList = [mobyDick, littleBro, alice, ftw, frankenstein, printCrime, pridePred, sysAdmin, huckFinn, iRobot, wuthHeight, peterPan, beingEarn, twoCities];
    var finalSourceText = "";

    //Array of all the words
    var wordArray;

    //Array of words that can appear on screen
    var wordBuffer = [];

    //chosen word
    var chosenWord = null;
    //previous word
    var previousWord = null;
    
    //final sentence
    var finalSentence = "";

    var booksLoaded = 0;
    
    resizeGameBoard();
    
    //listener for screen resize
	$(window).resize(function() {
		resizeGameBoard();
	});
	
	//make the player follow the mouse (start when mouse is over it)
	gameBoard.on("mousemove", function(event) {
		if(event.offsetY < gameboardHeight - player.height()) {
		    player.css({
		       top: event.offsetY
		    });
		}
	});
	
	//shoot when clicked
	gameBoard.on("click", function(event) {
		if(event.offsetY < gameboardHeight - player.height()) {
		    shoot(event.offsetY);
		}
	});
	
	//START!
    function startGame()
    {
    	console.log("Starting");
    	
    	timer = setInterval(function() {
        	displayNewWord()
        }, wordInterval);
    }
    
    //move words
    function moveWords()
    {
        clearInterval(moveWordsTimer);
        
        moveWordsTimer = setInterval(function() {
        	$(".word").css( "right", "+=2" );
        	
        	//remove if too far off the screen, then clear screen and add to sentance
        	$(".word").each(function()
            {
                if($(this).position().left < -150) {
                	//remove word
                	$(this).remove();
                	
                	addToSentance($(this).text());
                	
                	//set chosen word
                	setWord($(this).text());
                	
                	//clear screen
                	clearScreen();
                	
                	//increase level speed
                	moveWords();
                }
            });
        }, wordSpeed);
        
        //speed up for next level
        if(wordSpeed > 15) {
        	wordSpeed -= 5;
        }
    }
    
    
    //resize gameboard
    function resizeGameBoard()
    {
    	gameboardHeight = $(window).height() - $(".header").outerHeight() - $(".footer").outerHeight() - 100;
    	gameBoard.css("height", gameboardHeight + "px");
    }
    
    
    //clear screen of words
    function clearScreen()
    {
    	$(".word").remove();
    }
    
    //add new word to the screen.
    function displayNewWord()
    {
    	var newWord = "<div class='word font" + Math.ceil(Math.random()*10) + "' style='top: " + Math.ceil(Math.random()*90) + "%'>" + getRandomWord() + "</div>";
    	gameBoard.append(newWord);
    }
    
    //add new word to sentance
    function addToSentance(word)
    {
    	finalSentence += " " + word;
    	$(".footer").text(finalSentence);
    }
    
    //shoot
    function shoot(yPos)
    {
    	console.log("shooting");
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

            console.log("wordArray length: " + wordArray.length);

            stripWords();
        
            randomStartWords();
        }
    }

    //Strip punctuation from words in word array
    function stripWords()
    {
        for(var i = 0; i < wordArray.length; i++)
        {
            wordArray[i] = wordArray[i].replace(/\b[-.,;:()_&$#!?\[\]{}"']+\B|\B[-.,;:()_&$#!?\[\]{}"']+\b/g, "").toLocaleLowerCase();
        }
    }

    //get random words, for first set of words
    function randomStartWords()
    {
        console.log("RandomWords");
        
        wordBuffer = [];
        
        var i = 0;

        while(i < 50)
        {
            var randomNum = Math.floor(Math.random()*wordArray.length);

            if(wordArray[randomNum].length > 3) {
                wordBuffer.push( wordArray[randomNum]);

                i++;
            }
        }
        
        startGame();
    }

    //get next words base on the word passed in
    function genNextWords()
    {
        console.log("genNextWords");
        wordBuffer = [];

        if(finalSentence.length < 110) 
        {
            if(previousWord)
            {
                for(var i = 1; i < wordArray.length; i++)
                {
                    if(wordArray[i-1] + wordArray[i] == previousWord + chosenWord)
                    {
                        wordBuffer.push(wordArray[i+1]);
                    }
                }
            }
            else
            {
                for(var i = 0; i < wordArray.length; i++)
                {
                    if(wordArray[i] == chosenWord)
                    {
                        wordBuffer.push(wordArray[i+1]);
                    }
                }
            }
        }
        else
        {
            sendTweet();
        }
    }

    function getRandomWord()
    {
        console.log("getRandomWord");
        return wordBuffer[Math.floor(Math.random()*wordBuffer.length)];
    }
    
    function setWord(word)
    {
        previousWord = chosenWord;
        chosenWord = word;
        
        genNextWords();
    }

    //The final sentence is long enough, time to send the tweet!
    function sendTweet()
    {

    }
};

$(function() 
{
    new TweetDefendor();
});
