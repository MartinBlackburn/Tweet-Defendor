TweetDefendor = function() 
{

    //List of url for source text
    var mobyDick = "text/mobyDick.txt";

	//ebooks array
	var ebookList = [mobyDick];

    //Array of words on screen
    var wordsOnScreen = [];

    //final sentence
    var finalSentence = "";

    loadEbooks();

    //Loop through the ebook array and load each ebook
    function loadEbooks()
    {
        console.log("LoadEbook");
        for(var i = 0; i < ebookList.length; i++)
        {
            console.log("loading: " + ebookList[i]);
            $.ajax({
                url: ebookList[i],
                crossDomain: true,
                success: randomStartWords,
                error: function(xhr, error, text2){ console.log(xhr); console.log(error); console.log(text2); }
            });
        }
    }
	
	//get random words, for first level
    function randomStartWords(data)
    {
        console.log("RandomWords");
        //get an array of every word
        var wordArray = data.split(/\s+/g);

        for(var i = 0; i < 30; i++)
        {
            var randomNum = Math.ceil(Math.random()*wordArray.length);

            wordsOnScreen.push(wordArray[randomNum].toLowerCase());
        }

        console.log(wordsOnScreen);
    }

    //get next words base on previous word
    function getNextWords()
    {
    	
    }
    
    //clear screen of words
    function clearScreen()
    {
    	
    }
};

$(function() 
{
    new TweetDefendor();
});