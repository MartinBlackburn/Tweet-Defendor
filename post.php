<?php
	use Codebird\Codebird;

    session_start();
	
	require_once('twitterLib/codebird.php');
	
	Codebird::setConsumerKey('41UQMrk0F27RE2VPY6A5Pw', 'wVdsB8GZZqR3GpZYRqfU8sUgwnTWYXZCFmCjcsnk8M');
	$cb = Codebird::getInstance();
	
	if (!isset($_SESSION['oauth_token'])) {
	    // get the request token
	    $reply = $cb->oauth_requestToken(array(
	        'oauth_callback' => 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']
	    ));
	
	    // store the token
	    $cb->setToken($reply->oauth_token, $reply->oauth_token_secret);
	    $_SESSION['oauth_token'] = $reply->oauth_token;
	    $_SESSION['oauth_token_secret'] = $reply->oauth_token_secret;
	    $_SESSION['oauth_verify'] = true;
	
	    // redirect to auth website
	    $auth_url = $cb->oauth_authorize();
	    header('Location: ' . $auth_url);
	    die();
	
	} elseif (isset($_GET['oauth_verifier']) && isset($_SESSION['oauth_verify'])) {
	    // verify the token
	    $cb->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
	    unset($_SESSION['oauth_verify']);
	
	    // get the access token
	    $reply = $cb->oauth_accessToken(array(
	        'oauth_verifier' => $_GET['oauth_verifier']
	    ));
	
	    // store the token (which is different from the request token!)
	    $_SESSION['oauth_token'] = $reply->oauth_token;
	    $_SESSION['oauth_token_secret'] = $reply->oauth_token_secret;
	
	    // send to same URL, without oauth GET parameters
	    header('Location: ' . basename(__FILE__));
	    die();
	}
	
	// assign access token on each page load
	$cb->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
	
	//post tweet
	$reply = $cb->statuses_update("status=" . stripslashes($_POST['sentance']));
?>

<!doctype>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Tweet Defendor</title>
		
		<!-- Framework CSS -->
		<link href="css/respond.css" rel="stylesheet" type="text/css" media="screen" />
	    
	    <!-- Site CSS -->
	    <link href="css/default.css" rel="stylesheet" type="text/css" media="screen" />
	</head>
	<body>
		<div class="pageContainer homePage">
			<h1 class="title">Tweet Defendor</h1>
			
			<div class="about">
				<?php echo stripslashes($_POST['sentance']); ?>
			</div>
			
			<a class="button play" href="/game.php">Play again</a>
		</div>
	</body>
</html>