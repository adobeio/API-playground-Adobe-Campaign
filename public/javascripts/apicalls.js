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
		if (credentials.clientID) {
			campaignClientID = credentials.clientID;
			$('.clientID').text(campaignClientID);
		}
		if (credentials.clientSecret) {
			campaignClientSecret = credentials.clientSecret;
			$('.clientSecret').text(campaignClientSecret);
		}
		if (credentials.jwtToken) {
			campaignJWTToken = credentials.jwtToken;
			$('.jwtToken').text(campaignJWTToken);
		}
		if (credentials.accessToken) {
			campaignAccessToken = credentials.accessToken;
			$('.accessToken').text(campaignAccessToken);
		}
		if (credentials.tenant) {
			campaignTenant = credentials.tenant;
			$('.tenant').text(campaignTenant);
		}
		if (credentials.endPoint) {
			campaignEndpoint = credentials.endPoint;
			$('.endPoint').text(campaignEndpoint);
			$('#getQuery').val(campaignEndpoint+"/");
		}
	});

	socket.on('message', function(msg) {
		console.log(msg);
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