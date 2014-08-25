/* RainLoop Webmail (c) RainLoop Team | Licensed under CC BY-NC-SA 3.0 */
'use strict';

(function (module) {

	var
		ko = require('../External/ko.js')
	;

	/**
	 * @param {string} sEmail
	 * @param {boolean=} bCanBeDelete = true
	 * @constructor
	 */
	function AccountModel(sEmail, bCanBeDelete)
	{
		this.email = sEmail;
		this.deleteAccess = ko.observable(false);
		this.canBeDalete = ko.observable(bCanBeDelete);
	}

	AccountModel.prototype.email = '';

	/**
	 * @return {string}
	 */
	AccountModel.prototype.changeAccountLink = function ()
	{
		return require('../Common/LinkBuilder.js').change(this.email);
	};

	module.exports = AccountModel;

}(module));