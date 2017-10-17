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
		console.log(msg.status + ": " + msg.text);
		if(msg.status == ('Fail')) {
			$('.alert').text(msg.text).show();
		}
	});

	socket.on('CampaignConnection', function() {
		window.location.replace(window.location.protocol + '//' + window.location.host + "/apiCalls.html");
	});

	function listen(uri) {
	}

	$( "#campaignCredentials" ).submit(function( event ) {

		$('.alert').hide();

		event.preventDefault();

		var clientSecret = $( "input#clientSecret" ).val();
		var clientID = $( "input#clientID" ).val();
		var tenant = $( "input#tenant" ).val();
		var orgID = $( "input#orgID" ).val();
		var technicalAccount = $( "input#technicalAccount" ).val();

		if (clientSecret) {console.log("clientSecret: " + clientSecret);}
		if (clientID) {console.log("clientID: " + clientID);}
		if (tenant) {console.log("tenant: " + tenant);}

		socket.emit('getCampaignAccessToken', {clientSecret: clientSecret, clientID: clientID, tenant: tenant, orgID: orgID, technicalAccount: technicalAccount});
	});

});