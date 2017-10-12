$(function() {
	'use strict';

	// initiate socket
	var socketUrl = window.location.protocol + '//' + window.location.host;
	var socket;

	socket = io.connect(socketUrl);
	socket.on('welcome', function() {
		console.log("connected!");
	});

	socket.on('message', function(msg) {
		console.log(msg);
	});

	socket.on('CampaignConnection', function() {
		window.location.replace(window.location.protocol + '//' + window.location.host + "/apiCalls.html");
	});

	function listen(uri) {
	}

	$( "#campaignCredentials" ).submit(function( event ) {

		event.preventDefault();

		var jwtToken = $( "input#jwtToken" ).val();
		var clientSecret = $( "input#clientSecret" ).val();
		var clientID = $( "input#clientID" ).val();
		var tenant = $( "input#tenant" ).val();

		if (jwtToken) {console.log("jwtToken: " + jwtToken);}
		if (clientSecret) {console.log("clientSecret: " + clientSecret);}
		if (clientID) {console.log("clientID: " + clientID);}
		if (tenant) {console.log("tenant: " + tenant);}

		socket.emit('getCampaignAccessToken', {jwtToken: jwtToken, clientSecret: clientSecret, clientID: clientID, tenant: tenant});
	});

});