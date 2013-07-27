TweetDefendor = function() 
{
    //variables
    var finalSentence = "";
    var gameboardHeight = 0;
    var player = $(".player");
    
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
};

$(function() 
{
    new TweetDefendor();
});