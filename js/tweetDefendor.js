TweetDefendor = function() 
{
    //variables
    var finalSentence = "";
    var gameboardHeight = 0;
    
    resizeGameBoard();
    
    //listener for screen resize
	$(window).resize(function() {
		resizeGameBoard();
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
};

$(function() 
{
    new TweetDefendor();
});