'use strict';

console.clear();

var
	d = document
	, b = d.body
	, modal_timeout
	, collage_time = 500
	;


function escapeRegExp(str) {
	return typeof str == 'string' ? str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : str;
}

Element.prototype.removeClass = function (className) {
	this.className = this.className.replace(new RegExp('(^| )*' + escapeRegExp(className) + '( |$)+', 'ig'), '$2');

	return this;
};

Element.prototype.addClass = function (className) {
	if (!this.hasClass(className)) {
		this.className += (this.className ? ' ' + className : className);
	}

	return this;
};

Element.prototype.hasClass = function (className) {
	return (new RegExp('(^| )+' + escapeRegExp(className) + '( |$)+', 'ig')).test(this.className);
};

// Bind handler to link click
d.addEventListener('click', function (e) {

	if (e.target.getAttribute('data-modal-id')) {
		b.addClass('showing-modal');
		show_modal(e.target);
		return;
	}

	if (b.hasClass('showing-modal')) {
		hide_modals();
	}

	if (e.target.getAttribute('data-id')) {
		click_handler(e.target);
	}

});


// Link click handler
function click_handler(e) {

	var
		$e = d.querySelector('[data-target=' + e.getAttribute('data-id') + ']')
	;

	if (!$e.hasClass('show')) {
		$e.addClass('show');
		e.addClass('revealed');
	}

}

function hide_modals() {
	b.removeClass('showing-modal');
	d.querySelectorAll('[data-modal].showing').forEach(function(e) {
		e.removeClass('showing');
	});
}

function show_modal(e) {

	var
		$modal = d.querySelector('[data-modal=' + e.getAttribute('data-modal-id') + ']')
		, $kids = $modal.children
	;

	// Show modal
	$modal.addClass('showing').removeClass('cycling').removeClass('cycle-over');;

	// Is this a multi-modal?
	if ($kids.length > 1) {
		cycle_modal($modal, $kids, 1);
	}
}

function cycle_modal($modal, $kids, i) {

	clearTimeout(modal_timeout);
	modal_timeout = setTimeout(function() {
		$modal.addClass('cycling');
		
		if (!i) {
			$modal.removeClass('cycle-over');
		}

		if ($kids[i - 1]) {
			$kids[i - 1].style.visibility = '';
		}

		if ($kids[i]) {
			$kids[i].style.visibility = 'visible';
		}

		if ($kids[i + 1]) {
			cycle_modal($modal, $kids, i + 1);
		} else {
			$modal.addClass('cycle-over');
			$kids[i].style.visibility = '';
			cycle_modal($modal, $kids, 0);
		}
	}, collage_time);

}