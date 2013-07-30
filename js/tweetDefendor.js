TweetDefendor = function() 
{
    //variables
	var gameBoard = $(".gameBoard").first();
    var finalSentence = "";
    var gameboardHeight = 0;
    var player = $(".player");
    var wordInterval = 1000;
    var wordSpeed = 30;
    var hasEnded = false;
    
    //word timers
    var timer;
    var moveWordsTimer;
	moveWords();

    //ebooks array
    var ebookList = ["text/mobyDick.txt", "text/littleBro.txt", "text/alice.txt", "text/ftw.txt", "text/frankenstein.txt", 
                     "text/printCrime.txt", "text/pridePred.txt", "text/sysAdmin.txt", "text/huckFinn.txt", "text/iRobot.txt", 
                     "text/wuthHeights.txt", "text/peterPan.txt", "text/beingEarn.txt", "text/twoCities.txt"];
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
        moveWordsTimer = setInterval(function() {
        	//remove if too far off the screen, then clear screen and add to sentance
        	$(".word").each(function()
            {
                if($(this).position().left < -150) {
                	//remove word
                	$(this).remove();
                	
                	//add word to sentance
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
    	$(".word, .bullet").remove();
    }
    
    //add new word to the screen.
    function displayNewWord()
    {
    	var newWord = "<div class='word font" + Math.ceil(Math.random()*10) + " animation" + Math.ceil(Math.random()*4) + "' style='top: " + Math.ceil(Math.random()*90) + "%'>" + getRandomWord() + "</div>";
    	gameBoard.append(newWord);
    }
    
    //add new word to sentance
    function addToSentance(word)
    {
    	finalSentence += " " + word;
    	$(".footer").text(finalSentence);
    }
    
    //shoot when clicked
    var canShoot = true;
    
    var canShootTimer = setInterval(function() {
    	canShoot = true;
    }, 400);
    
	gameBoard.on("click", function(event) {
		if(event.offsetY < gameboardHeight - player.height()) {
		    if(canShoot && $(".bullet").length < 15) {
		    	shoot(event.offsetY);
		    }
		    
		    canShoot = false;
		}
	});
	
    var moveButtlets = setInterval(function() {
    	$(".bullet").each(function()
        {
        	var bullet = $(this);
        	$(".word").each(function()
        	{
        		if(isColliding(bullet, $(this)))
        		{
        			bullet.remove();
        			$(this).remove();
        		}
        	});
     

    		if($(this).position().left > gameBoard.outerWidth()) {
            	//remove bullet
            	$(this).remove();
            }
        });
    }, 30);
    
    function shoot(yPos)
    {
    	console.log("shooting");

    	var newBullet = "<div class='bullet' style='top: " + (yPos + Math.random() * 5) + "'</div>";
    	gameBoard.append(newBullet);
    }

    function isColliding(a, b) {
		return !(
		((a.offset().top + a.height()) < (b.offset().top)) ||
		(a.offset().top > (b.offset().top + b.height())) ||
		((a.offset().left + a.width()) < b.offset().left) ||
		(a.offset().left > (b.offset().left + b.width()))
		);
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
            wordArray[i] = wordArray[i].replace(/\b[-.,;:()_&$#*!?\[\]{}"']+\B|\B[-.,;:()_&$#*!?\[\]{}"']+\b/g, "").toLocaleLowerCase();
        }
    }

    //get random words, for first set of words
    function randomStartWords()
    {
        console.log("RandomWords");
        
        wordBuffer = [];
        
        var i = 0;

        while(i < 100)
        {
            var randomNum = Math.floor(Math.random()*wordArray.length);

            if(wordArray[randomNum].length > 3) {
                wordBuffer.push( wordArray[randomNum]);

                i++;
            }
        }

        wordBuffer = eliminateDuplicates(wordBuffer);
        
        startGame();
    }

    //get next words base on the word passed in
    function genNextWords()
    {
        console.log("genNextWords");
        wordBuffer = [];

        if(finalSentence.length < 107) 
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

           wordBuffer = eliminateDuplicates(wordBuffer);
           
           if(wordBuffer.length <= 1) {
        	   //add word to sentance
        	   addToSentance(wordBuffer[0]);
           	
	           //set chosen word
	           setWord(wordBuffer[0]);
	           	
	           //clear screen
	           clearScreen();
           }
        }
        else
        {
            sendTweet();
        }
    }

    function eliminateDuplicates(arr)
    {
		var len = arr.length;
		var out = [];
		var obj = {};
		var i;
	
		for (i=0; i<len; i++) 
		{
			obj[arr[i]]=0;
		}
		
		for (i in obj) 
		{
			out.push(i);
		}
		
		return out;
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
        console.log("sending tweet");
        
        //stop timers
        clearInterval(timer);
        clearInterval(moveWordsTimer);
        
        //get final sentence
        finalSentence = finalSentence + "... via @TweetDefendor";
        
        //post tweet and return final screen
        $.ajax({
            type: "POST",
            url: "/post.php",
            data: { sentance: finalSentence},
            success: displayWin,
            error: function(xhr, error, text2){ console.log(xhr); console.log(error); console.log(text2); }
        });
    }
    
    function displayWin(data)
    {
        console.log("disaply win page");
        $('body').html(data);
    }
};

$(function() 
{
    new TweetDefendor();
});
