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

			// update queries
			var postQuery = 'profileAndServices/profile/';

			$('#getQuery').val(campaignEndpoint+"/");
			$('#postQuery').val(campaignEndpoint+"/"+postQuery);
			$('#patchQuery').val(campaignEndpoint+"/"+postQuery+"PUT_PKEY_HERE");
			$('#deleteQuery').val(campaignEndpoint+"/"+postQuery+"PUT_PKEY_HERE");
		} else {
			// if there's no campaign connection, go back to the credentials page
			window.location.replace(window.location.protocol + '//' + window.location.host);
		}
	});

	socket.on('message', function(msg) {
		console.log(msg.status + ": " + msg.text);
		if(msg.status == ('Fail')) {
			$('.alert').text(msg.text).show();
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

		$('.sample-query-results-label').removeAttr('hidden');

		socket.emit('runCampaignQuery', {method:sampleQueryMethod, url:url, returnCSSSelector: '#sample-query-results'});
	});

	$('#get-query-button').on('click', function (e) {
		var url = $('#getQuery').val();
		var method = 'GET';

		$('.getQueryMethod').text(method);
		$('.getQuery').text(url);
		$('#get-query').removeAttr('hidden');

		socket.emit('runCampaignQuery', {method:method, url:url, returnCSSSelector: '#get-query-results'});
	});

	$('#post-query-button').on('click', function (e) {
		var url = $('#postQuery').val();
		var body = $('#postQueryBody').val();
		var method = 'POST';

		$('.postQueryMethod').text(method);
		$('.postQuery').text(url);
		$('.postQueryBody').text(body);
		$('#post-query').removeAttr('hidden');

		socket.emit('runCampaignQuery', {method:method, url:url, body:body, returnCSSSelector: '#post-query-results'});
	});

	$('#patch-query-button').on('click', function (e) {
		var url = $('#patchQuery').val();
		var body = $('#patchQueryBody').val();
		var method = 'PATCH';

		$('.patchQueryMethod').text(method);
		$('.patchQuery').text(url);
		$('.patchQueryBody').text(body);
		$('#patch-query').removeAttr('hidden');

		socket.emit('runCampaignQuery', {method:method, url:url, body:body, returnCSSSelector: '#patch-query-results'});
	});

	$('#delete-query-button').on('click', function (e) {
		var url = $('#deleteQuery').val();
		var method = 'DELETE';

		$('.deleteQueryMethod').text(method);
		$('.deleteQuery').text(url);
		$('#delete-query').removeAttr('hidden');

		socket.emit('runCampaignQuery', {method:method, url:url, returnCSSSelector: '#delete-query-results'});
	});


});