$(function() {
	'use strict';

	// initiate socket
	var socketUrl = window.location.protocol + '//' + window.location.host;
	var socket;

	var campaignClientID, campaignClientSecret, campaignJWTToken, campaignAccessToken, campaignTenant, campaignEndpoint;

	socket = io.connect(socketUrl);
	socket.on('welcome', function() {
		console.log("connected!");
		socket.emit('getCampaignCredentials');
	});

	socket.on('campaignCredentials', function(credentials) {
		if (credentials.clientID && credentials.clientSecret && credentials.jwtToken && credentials.accessToken && credentials.tenant && credentials.endPoint) {
			campaignClientID = credentials.clientID;
			$('.clientID').text(campaignClientID);

			campaignClientSecret = credentials.clientSecret;
			$('.clientSecret').text(campaignClientSecret);

			campaignJWTToken = credentials.jwtToken;
			$('.jwtToken').text(campaignJWTToken);

			campaignAccessToken = credentials.accessToken;
			$('.accessToken').text(campaignAccessToken);

			campaignTenant = credentials.tenant;
			$('.tenant').text(campaignTenant);

			campaignEndpoint = credentials.endPoint;
			$('.endPoint').text(campaignEndpoint);
			$('#getQuery').val(campaignEndpoint+"/");
		} else {
			// if there's no campaign connection, go back to the credentials page
			window.location.replace(window.location.protocol + '//' + window.location.host);
		}
	});

	socket.on('message', function(msg) {
		console.log(msg.status + "/t" + msg.text);
		if(msg.status.contains('Fail')) {
			alert (msg.text);
		}
	});

	socket.on('campaignQuerySuccess', function(info) {
		console.log(info);
		$(info.returnCSSSelector).html('<pre>' + JSON.stringify(info.response,null,'\t') +'</pre').removeAttr('hidden');
	});

	function listen(uri) {
	}

	var sampleQuery = '/profileAndServices/profile/email?_lineCount=10';
	var sampleQueryMethod = 'GET';
	$('.sampleQuery').text(sampleQuery);
	$('.sampleQueryMethod').text(sampleQueryMethod);

	$('#sample-query-button').on('click', function (e) {
		var url = campaignEndpoint + sampleQuery;
		socket.emit('runCampaignQuery', {method:sampleQueryMethod, url:url, returnCSSSelector: '#sample-query-results'});
	});

	$('#get-query-button').on('click', function (e) {
		var url = $('#getQuery').val();
		var method = 'GET';
		socket.emit('runCampaignQuery', {method:method, url:url, returnCSSSelector: '#get-query-results'});
	})


});