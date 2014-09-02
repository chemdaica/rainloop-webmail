
(function (module, require) {

	'use strict';

	var
		_ = require('_'),
		ko = require('ko'),

		Enums = require('Enums'),
		Utils = require('Utils'),

		Remote = require('Storage:RainLoop:Remote'),
		Data = require('Storage:RainLoop:Data'),

		kn = require('App:Knoin'),
		KnoinAbstractViewModel = require('Knoin:AbstractViewModel')
	;

	/**
	 * @constructor
	 * @extends KnoinAbstractViewModel
	 */
	function PopupsIdentityViewModel()
	{
		KnoinAbstractViewModel.call(this, 'Popups', 'PopupsIdentity');

		this.id = '';
		this.edit = ko.observable(false);
		this.owner = ko.observable(false);

		this.email = ko.observable('').validateEmail();
		this.email.focused = ko.observable(false);
		this.name = ko.observable('');
		this.name.focused = ko.observable(false);
		this.replyTo = ko.observable('').validateSimpleEmail();
		this.replyTo.focused = ko.observable(false);
		this.bcc = ko.observable('').validateSimpleEmail();
		this.bcc.focused = ko.observable(false);

	//	this.email.subscribe(function () {
	//		this.email.hasError(false);
	//	}, this);

		this.submitRequest = ko.observable(false);
		this.submitError = ko.observable('');

		this.addOrEditIdentityCommand = Utils.createCommand(this, function () {

			if (!this.email.hasError())
			{
				this.email.hasError('' === Utils.trim(this.email()));
			}

			if (this.email.hasError())
			{
				if (!this.owner())
				{
					this.email.focused(true);
				}

				return false;
			}

			if (this.replyTo.hasError())
			{
				this.replyTo.focused(true);
				return false;
			}

			if (this.bcc.hasError())
			{
				this.bcc.focused(true);
				return false;
			}

			this.submitRequest(true);

			Remote.identityUpdate(_.bind(function (sResult, oData) {

				this.submitRequest(false);
				if (Enums.StorageResultType.Success === sResult && oData)
				{
					if (oData.Result)
					{
						require('App:RainLoop').accountsAndIdentities();
						this.cancelCommand();
					}
					else if (oData.ErrorCode)
					{
						this.submitError(Utils.getNotification(oData.ErrorCode));
					}
				}
				else
				{
					this.submitError(Utils.getNotification(Enums.Notification.UnknownError));
				}

			}, this), this.id, this.email(), this.name(), this.replyTo(), this.bcc());

			return true;

		}, function () {
			return !this.submitRequest();
		});

		this.label = ko.computed(function () {
			return Utils.i18n('POPUPS_IDENTITIES/' + (this.edit() ? 'TITLE_UPDATE_IDENTITY': 'TITLE_ADD_IDENTITY'));
		}, this);

		this.button = ko.computed(function () {
			return Utils.i18n('POPUPS_IDENTITIES/' + (this.edit() ? 'BUTTON_UPDATE_IDENTITY': 'BUTTON_ADD_IDENTITY'));
		}, this);

		kn.constructorEnd(this);
	}

	kn.extendAsViewModel(['View:Popup:Identity', 'PopupsIdentityViewModel'], PopupsIdentityViewModel);
	_.extend(PopupsIdentityViewModel.prototype, KnoinAbstractViewModel.prototype);

	PopupsIdentityViewModel.prototype.clearPopup = function ()
	{
		this.id = '';
		this.edit(false);
		this.owner(false);

		this.name('');
		this.email('');
		this.replyTo('');
		this.bcc('');

		this.email.hasError(false);
		this.replyTo.hasError(false);
		this.bcc.hasError(false);

		this.submitRequest(false);
		this.submitError('');
	};

	/**
	 * @param {?IdentityModel} oIdentity
	 */
	PopupsIdentityViewModel.prototype.onShow = function (oIdentity)
	{
		this.clearPopup();

		if (oIdentity)
		{
			this.edit(true);

			this.id = oIdentity.id;
			this.name(oIdentity.name());
			this.email(oIdentity.email());
			this.replyTo(oIdentity.replyTo());
			this.bcc(oIdentity.bcc());

			this.owner(this.id === Data.accountEmail());
		}
	};

	PopupsIdentityViewModel.prototype.onFocus = function ()
	{
		if (!this.owner())
		{
			this.email.focused(true);
		}
	};

	module.exports = PopupsIdentityViewModel;

}(module, require));