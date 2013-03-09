/*jshint jquery:true */
/*global PAYPAL:true */

(function () {
	'use strict';


	$('.modal').on('shown', function (e) {
		// Focus on the first input when modal is available
		$(this).find(':input:text:enabled:first').focus();
	});


	$(document).on('click', '[data-modal-save="true"]', function (e) {
		var data = {},
			modal = $(this).parents('.modal').first(),
			example = modal.closest('.example'),
			code = example.find('code'),
			tryit = example.find('.tryit'),
			inputs = modal.find('.modal-body :input'),
			requiredInputs = modal.find('[required="required"]'),
			input, merchant, el, len, i, key;


		// Don't update if we don't have all of the required inputs
		// TODO: This can be cleaned up
		for (i = 0, len = requiredInputs.length; i < len; i++) {
			var requiredInput = $(requiredInputs[i]),
				controlGroup = requiredInput.parents('.control-group').first();

			if (requiredInput.val() === '') {
				controlGroup.addClass('error');
				requiredInput.focus();

				return;
			} else {
				controlGroup.removeClass('error');
			}
		}

		// Build a map out of the form data
		for (i = 0, len = inputs.length; i < len; i++) {
			input = $(inputs[i]);

			data[input.attr('name')] = {
				value: input.val()
			};
		}

		// Create a script tag to use as the HTML
		el = document.createElement('script');

		if (data.button && data.button.value === 'cart') {
			el.src = 'paypal-button-minicart.min.js?merchant=' + data.business.value;
		} else {
			el.src = 'paypal-button.min.js?merchant=' + data.business.value;
		}

		for (key in data) {
			if (key !== 'business' && data[key].value !== '') {
				el.setAttribute('data-' + key, data[key].value);
			}
		}

		code.text(el.outerHTML.replace(/data-/g, "\n    data-").replace("></" + "script>", "\n></" + "script>"));

		// Update the button
		tryit.empty();
		PAYPAL.apps.ButtonFactory.create(data.business.value, data, data.button.value, tryit[0]);

		// Close the modal
		modal.modal('hide');
	});

}());