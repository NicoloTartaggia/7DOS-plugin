define(["app/plugins/sdk","lodash"], function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var jsimportctrl_1 = __webpack_require__(3);
exports.PanelCtrl = jsimportctrl_1.JsImportCtrl;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = __webpack_require__(4);
var _ = __webpack_require__(5);
var properties_1 = __webpack_require__(6);
var panelDefaults = {
    JsBaesianNetwork: null,
    content: 'graph LR\n' +
    'A[Square Rect] -- Link text --> B((Circle))\n' +
    'A --> C(Round Rect)\n' +
    'B --> D{Rhombus}\n' +
    'C --> D\n' };var

JsImportCtrl = function (_sdk_1$PanelCtrl) {_inherits(JsImportCtrl, _sdk_1$PanelCtrl);
    function JsImportCtrl($scope, $injector) {_classCallCheck(this, JsImportCtrl);var _this = _possibleConstructorReturn(this, (JsImportCtrl.__proto__ || Object.getPrototypeOf(JsImportCtrl)).call(this,
        $scope, $injector));
        _.defaults(_this.panel, panelDefaults);
        _this.textJson = "Inserire una rete in formato json valida";
        _this.time = "time";
        _this.events.on('render', _this.importJs.bind(_this));
        _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));return _this;
    }_createClass(JsImportCtrl, [{ key: "onInitEditMode", value: function onInitEditMode()
        {
            this.addEditorTab('Diagram', properties_1.diagramEditor, 2);
        } }, { key: "importJs", value: function importJs()
        {
            try {
                var obj = JSON.parse(this.panel.JsBaesianNetwork); //parsing del JSON
                this.JsBN = obj;
                this.textJson = "struttura valida";
            }
            catch (e) {
                this.textJson = "struttura non valida";
                this.JsBN = JSON.parse("{}");
            }
        } }, { key: "link", value: function link(
        scope, element) {
        } }]);return JsImportCtrl;}(sdk_1.PanelCtrl);

JsImportCtrl.templateUrl = "panels/partials/module.html";
JsImportCtrl.scrollable = true;
exports.JsImportCtrl = JsImportCtrl;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pluginName = 'js-bayes',diagramEditor = 'public/plugins/' + pluginName + '/panels/partials/diagramEditor.html';
exports.pluginName = pluginName;
exports.diagramEditor = diagramEditor;

/***/ })
/******/ ])});;