describe('textAngular', function(){
	/*
		Display Tests
	*/
	
	describe('Minimal Initiation', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular><p>Test Content</p></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		describe('Adds Correct Classes and Elements', function () {
			it('add .ta-root to base element', function(){
				expect(jQuery(element).hasClass('.ta-root'));
			});
			it('adds 2 .ta-editor elements', function(){
				expect(jQuery('.ta-editor', element).length).toBe(2);
			});
			it('adds the WYSIWYG div', function(){
				expect(jQuery('div.ta-text.ta-editor', element).length).toBe(1);
			});
			it('adds the textarea', function(){
				expect(jQuery('textarea.ta-html.ta-editor', element).length).toBe(1);
			});
			it('no hidden form submission element', function(){
				expect(jQuery('input[type=hidden][name=test]', element).length).toBe(0);
			});
		});
	});
	
	describe('Basic Initiation without ng-model', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"><p>Test Content</p></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		describe('Adds Correct Classes and Elements', function () {
			it('add .ta-root to base element', function(){
				expect(jQuery(element).hasClass('.ta-root'));
			});
			it('adds 2 .ta-editor elements', function(){
				expect(jQuery('.ta-editor', element).length).toBe(2);
			});
			it('adds the WYSIWYG div', function(){
				expect(jQuery('div.ta-text.ta-editor', element).length).toBe(1);
			});
			it('adds the textarea', function(){
				expect(jQuery('textarea.ta-html.ta-editor', element).length).toBe(1);
			});
			it('adds one hidden form submission element', function(){
				expect(jQuery('input[type=hidden][name=test]', element).length).toBe(1);
			});
		});
	});
	
	describe('Add classes via attributes', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test" ta-focussed-class="test-focus-class" ta-text-editor-class="test-text-class" ta-html-editor-class="test-html-class"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('Adds Correct Classes', function () {
			it('initially has no focus class', function(){
				expect(!jQuery(element).hasClass('.test-focus-class'));
			});
			it('adds focus class when ta-text is focussed', function(){
				jQuery('.ta-text', element).triggerHandler('focus');
				expect(jQuery(element).hasClass('.test-focus-class'));
			});
			it('adds focus class when ta-html is focussed', function(){
				jQuery('.ta-html', element).triggerHandler('focus');
				expect(jQuery(element).hasClass('.test-focus-class'));
			});
			it('adds text editor class', function(){
				expect(jQuery('.ta-text', element).hasClass('.test-text-class'));
			});
			it('adds html editor class', function(){
				expect(jQuery('.ta-html', element).hasClass('.test-html-class'));
			});
		});
	});
	
	describe('Change classes via decorator', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular', function($provide){
			// change all the classes at once
			$provide.decorator('taOptions', ['$delegate', function(taOptions){
				taOptions.classes.focussed = "test-focus-class";
				taOptions.classes.disabled = "disabled-test";
				taOptions.classes.textEditor = 'test-text-class';
				taOptions.classes.htmlEditor = 'test-html-class';
				return taOptions;
			}]);
		}));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		it('should add .test-focus-class instead of default .focussed', function(){
			jQuery('.ta-text', element).triggerHandler('focus');
			expect(jQuery(element).hasClass('.test-focus-class'));
		});
		it('adds text editor class', function(){
			expect(jQuery('.ta-text', element).hasClass('.test-text-class'));
		});
		it('adds html editor class', function(){
			expect(jQuery('.ta-html', element).hasClass('.test-html-class'));
		});
		it('adds disabled class', function(){
			expect(jQuery(element).hasClass('.disabled-test'));
		});
	});
	
	describe('Add tabindex attribute', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test" tabindex="42"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('Check moved across', function () {
			it('to textEditor', function(){
				expect(jQuery('.ta-text', element).attr('tabindex')).toBe('42');
			});
			it('to htmlEditor', function(){
				expect(jQuery('.ta-html', element).attr('tabindex')).toBe('42');
			});
			it('removed from .ta-root', function(){
				expect(element.attr('tabindex')).toBeUndefined();
			});
		});
	});
	
	describe('Disable the editor', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.disabled = true;
			element = _$compile_('<text-angular name="test" ta-disabled="disabled"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('check disabled class', function () {
			it('is added initially', function(){
				expect(jQuery(element).hasClass('disaled'));
			});
			it('is removed on change to false', function(){
				$rootScope.disabled = false;
				$rootScope.$digest();
				expect(!jQuery(element).hasClass('disabled'));
			});
			it('is added on change to true', function(){
				$rootScope.disabled = false;
				$rootScope.$digest();
				$rootScope.disabled = true;
				$rootScope.$digest();
				expect(jQuery(element).hasClass('disabled'));
			});
		});
	});
	
	describe('Check view change', function(){
		'use strict';
		var $rootScope, element, editorScope;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_, textAngularManager) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"></text-angular>')($rootScope);
			$rootScope.$digest();
			editorScope = textAngularManager.retrieveEditor('test').scope;
		}));
		
		it('initially should hide .ta-html and show .ta-text', function(){
			expect(jQuery('.ta-text', element).is(':visible:focus'));
			expect(!jQuery('.ta-html', element).is(':visible'));
		});
		
		describe('from WYSIWYG text to RAW HTML view', function () {
			it('should hide .ta-text and show .ta-html', function(){
				editorScope.switchView();
				expect(!jQuery('.ta-text', element).is(':visible'));
				expect(jQuery('.ta-html', element).is(':visible:focus'));
			});
		});
		
		describe('from RAW HTML to WYSIWYG text view', function () {
			it('should hide .ta-html and show .ta-text', function(){
				editorScope.switchView();
				editorScope.switchView();
				expect(jQuery('.ta-text', element).is(':visible:focus'));
				expect(!jQuery('.ta-html', element).is(':visible'));
			});
		});
	});
	
	describe('Check focussed class adding', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('should have added .focussed', function(){
			it('on trigger focus on ta-text', function(){
				element.find('.ta-text').triggerHandler('focus');
				expect(element.hasClass('focussed'));
			});
			it('on trigger focus on ta-html', function(){
				element.find('.ta-html').triggerHandler('focus');
				expect(element.hasClass('focussed'));
			});
		});
		
		describe('should have removed .focussed', function(){
			it('on ta-text trigger blur', function(){	
				element.find('.ta-text').triggerHandler('focus');
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler('blur');
				expect(!element.hasClass('focussed'));
			});
			it('on ta-html trigger blur', function(){
				element.find('.ta-html').triggerHandler('focus');
				$rootScope.$digest();
				element.find('.ta-html').triggerHandler('blur');
				expect(!element.hasClass('focussed'));
			});
		});
	});
	
	describe('Check text and html editor setup functions', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.attrSetup = function($element){
				$element.attr('testattr', 'trueish');
			};
			element = _$compile_('<text-angular ta-text-editor-setup="attrSetup" ta-html-editor-setup="attrSetup" name="test"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('should have added attribute to', function(){
			it('ta-text', function(){
				expect(element.find('.ta-text').attr('testattr')).toBe('trueish');
			});
			it('ta-html', function(){
				expect(element.find('.ta-html').attr('testattr')).toBe('trueish');
			});
		});
	});
	
	describe('Check placeholder passthrough', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test" placeholder="Test Placeholder"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		describe('should have added placeholder to', function(){
			it('.ta-text', function(){
				expect(element.find('.ta-text').attr('placeholder')).toBe('Test Placeholder');
			});
			it('.ta-html', function(){
				expect(element.find('.ta-html').attr('placeholder')).toBe('Test Placeholder');
			});
		});
	});
	
	describe('registration', function(){
		beforeEach(module('textAngular'));
		it('should add itself to the textAngularManager', inject(function($rootScope, $compile, textAngularManager){
			$compile('<text-angular name="test"></text-angular>')($rootScope);
			expect(textAngularManager.retrieveEditor('test')).not.toBeUndefined();
		}));
		
		it('should register toolbars to itself', inject(function($rootScope, $compile, textAngularManager){
			var toolbar1 = {name: 'test-toolbar1'};
			var toolbar2 = {name: 'test-toolbar2'};
			textAngularManager.registerToolbar(toolbar1);
			textAngularManager.registerToolbar(toolbar2);
			$compile('<text-angular name="test" ta-target-toolbars="test-toolbar1,test-toolbar2"></text-angular>')($rootScope);
			var _toolbars = textAngularManager.retrieveToolbarsViaEditor('test');
			expect(_toolbars[0]).toBe(toolbar1);
			expect(_toolbars[1]).toBe(toolbar2);
		}));
	});
	
	describe('unregistration', function(){
		beforeEach(module('textAngular'));
		it('should remove itself from the textAngularManager on $destroy', inject(function($rootScope, $compile, textAngularManager){
			var element = $compile('<text-angular name="test"></text-angular>')($rootScope);
			$rootScope.$digest();
			textAngularManager.retrieveEditor('test').scope.$destroy();
			expect(textAngularManager.retrieveEditor('test')).toBeUndefined();
		}));
	});
	
	/*
		Form validation tests
	*/
		
	describe('form validation', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.htmlcontent = '<p>Test Content</p>';
			element = _$compile_('<form name="form"><text-angular name="test" ng-model="htmlcontent"></text-angular></form>')($rootScope);
			$rootScope.$digest();
		}));
		describe('should start with', function () {
			it('pristine', function(){
				expect($rootScope.form.$pristine).toBe(true);
			});
			it('not dirty', function(){
				expect($rootScope.form.$dirty).toBe(false);
			});
			it('field pristine', function(){
				expect($rootScope.form.test.$pristine).toBe(true);
			});
			it('field not dirty', function(){
				expect($rootScope.form.test.$dirty).toBe(false);
			});
		});
		
		describe('should NOT change on direct model change', function () {
			beforeEach(function(){
				$rootScope.htmlcontent = '<div>Test Change Content</div>';
				$rootScope.$digest();
			});
			it('pristine', function(){
				expect($rootScope.form.$pristine).toBe(true);
			});
			it('not dirty', function(){
				expect($rootScope.form.$dirty).toBe(false);
			});
			it('field pristine', function(){
				expect($rootScope.form.test.$pristine).toBe(true);
			});
			it('field not dirty', function(){
				expect($rootScope.form.test.$dirty).toBe(false);
			});
		});
		
		describe('should change on input update', function () {
			beforeEach(function(){
				element.find('.ta-text').html('<div>Test Change Content</div>');
				element.find('.ta-text').triggerHandler('keyup');
				$rootScope.$digest();
			});
			it('not pristine', function(){
				expect($rootScope.form.$pristine).toBe(false);
			});
			it('dirty', function(){
				expect($rootScope.form.$dirty).toBe(true);
			});
			it('field not pristine', function(){
				expect($rootScope.form.test.$pristine).toBe(false);
			});
			it('field dirty', function(){
				expect($rootScope.form.test.$dirty).toBe(true);
			});
		});
	});
	
	/*
		Data Tests
	*/
	
	describe('Basic Initiation without ng-model', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"><p>Test Content</p></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		describe('Inserts the current information into the fields', function(){
			it('populates the WYSIWYG area', function(){
				expect(jQuery('.ta-text p', element).length).toBe(1);
			});
			it('populates the textarea', function(){
				expect(jQuery('.ta-html', element).val()).toBe('<p>Test Content</p>');
			});
			it('populates the hidden input value', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<p>Test Content</p>');
			});
		});
	});
	
	describe('Basic Initiation with ng-model', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.htmlcontent = '<p>Test Content</p>';
			element = _$compile_('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		describe('Inserts the current information into the fields', function(){
			it('populates the WYSIWYG area', function(){
				expect(jQuery('.ta-text p', element).length).toBe(1);
			});
			it('populates the textarea', function(){
				expect(jQuery('.ta-html', element).val()).toBe('<p>Test Content</p>');
			});
			it('populates the hidden input value', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<p>Test Content</p>');
			});
		});
	});
	
	describe('Basic Initiation with ng-model and originalContents', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.htmlcontent = '<p>Test Content</p>';
			element = _$compile_('<text-angular name="test" ng-model="htmlcontent"><p>Original Content</p></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		describe('Inserts the current information into the fields overriding the original content', function(){
			it('populates the WYSIWYG area', function(){
				expect(jQuery('.ta-text p', element).length).toBe(1);
			});
			it('populates the textarea', function(){
				expect(jQuery('.ta-html', element).val()).toBe('<p>Test Content</p>');
			});
			it('populates the hidden input value', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<p>Test Content</p>');
			});
		});
	});
	
	describe('Updates without ng-model', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			element = _$compile_('<text-angular name="test"><p>Test Content</p></text-angular>')($rootScope);
			$rootScope.$digest();
			jQuery('.ta-text', element).html('<div>Test Change Content</div>');
			jQuery('.ta-text', element).triggerHandler('keyup');
			$rootScope.$digest();
		}));
		
		describe('updates from .ta-text', function(){
			it('should update .ta-html', function(){
				expect(jQuery('.ta-html', element).val()).toBe('<div>Test Change Content</div>');
			});
			it('should update input[type=hidden]', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<div>Test Change Content</div>');
			});
		});
		
		describe('updates from .ta-html', function(){
			it('should update .ta-text', function(){
				expect(jQuery('.ta-text', element).html()).toBe('<div>Test Change Content</div>');
			});
			it('should update input[type=hidden]', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<div>Test Change Content</div>');
			});
		});
	});
	
	describe('Updates with ng-model', function(){
		'use strict';
		var $rootScope, element;
		beforeEach(module('textAngular'));
		beforeEach(inject(function (_$compile_, _$rootScope_) {
			$rootScope = _$rootScope_;
			$rootScope.htmlcontent = '<p>Test Content</p>';
			element = _$compile_('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			$rootScope.$digest();
			$rootScope.htmlcontent = '<div>Test Change Content</div>';
			$rootScope.$digest();
		}));
		
		describe('updates from model to display', function(){
			it('should update .ta-html', function(){
				expect(jQuery('.ta-html', element).val()).toBe('<div>Test Change Content</div>');
			});
			it('should update .ta-text', function(){
				expect(jQuery('.ta-text', element).html()).toBe('<div>Test Change Content</div>');
			});
			it('should update input[type=hidden]', function(){
				expect(jQuery('input[type=hidden]', element).val()).toBe('<div>Test Change Content</div>');
			});
		});
	});
	
	describe('ng-model should handle undefined and null', function(){
		'use strict';
		beforeEach(module('textAngular'));
		it('should handle initial undefined to empty-string', inject(function ($compile, $rootScope) {
			$rootScope.htmlcontent = undefined;
			var element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			$rootScope.$digest();
			expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
		}));
		
		it('should handle initial null to empty-string', inject(function ($compile, $rootScope) {
			$rootScope.htmlcontent = null;
			var element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			$rootScope.$digest();
			expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
		}));
		
		it('should handle initial undefined to originalContents', inject(function ($compile, $rootScope) {
			$rootScope.htmlcontent = undefined;
			var element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents</text-angular>')($rootScope);
			$rootScope.$digest();
			expect(jQuery('.ta-text', element).html()).toBe('Test Contents');
		}));
		
		it('should handle initial null to originalContents', inject(function ($compile, $rootScope) {
			$rootScope.htmlcontent = null;
			var element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents</text-angular>')($rootScope);
			$rootScope.$digest();
			expect(jQuery('.ta-text', element).html()).toBe('Test Contents');
		}));
		
		describe('should reset', function(){
			it('from undefined to empty-string', inject(function ($compile, $rootScope) {
				$rootScope.htmlcontent = 'Test Content';
				var element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
				$rootScope.$digest();
				$rootScope.htmlcontent = undefined;
				$rootScope.$digest();
				expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
			}));
			
			it('from null to empty-string', inject(function ($compile, $rootScope) {
				$rootScope.htmlcontent = 'Test Content';
				var element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
				$rootScope.$digest();
				$rootScope.htmlcontent = null;
				$rootScope.$digest();
				expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
			}));
			
			it('from undefined to blank/emptystring WITH originalContents', inject(function ($compile, $rootScope) {
				$rootScope.htmlcontent = 'Test Content1';
				var element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents2</text-angular>')($rootScope);
				$rootScope.$digest();
				$rootScope.htmlcontent = undefined;
				$rootScope.$digest();
				expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
			}));
			
			it('from null to blank/emptystring WITH originalContents', inject(function ($compile, $rootScope) {
				$rootScope.htmlcontent = 'Test Content1';
				var element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents2</text-angular>')($rootScope);
				$rootScope.$digest();
				$rootScope.htmlcontent = null;
				$rootScope.$digest();
				expect(jQuery('.ta-text', element).html()).toBe('<p><br></p>');
			}));
		});
	});
	
	describe('should have correct startAction and endAction functions', function(){
		'use strict';
		describe('should work with rangy loaded', function(){
			beforeEach(module('textAngular'));
			
			it('should have rangy loaded with save-restore module', function(){
				expect(window.rangy).toBeDefined();
				expect(window.rangy.saveSelection).toBeDefined();
			});
			var editorScope, element, sel, range;
			beforeEach(inject(function($compile, $rootScope, textAngularManager, $document){
				$rootScope.htmlcontent = '<p>Lorem ipsum dolor sit amet, <i>consectetur adipisicing</i> elit, <strong>sed do eiusmod tempor incididunt</strong> ut labore et dolore magna aliqua.</p>';
				element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents2</text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				editorScope = textAngularManager.retrieveEditor('test').scope;
				// setup selection
				sel = window.rangy.getSelection();
				range = window.rangy.createRangyRange();
				range.selectNodeContents(element.find('.ta-text p strong')[0]);
				sel.setSingleRange(range);
			}));
			afterEach(function(){
				element.remove();
			});
			describe('startAction should return a function that will restore a selection', function(){
				it('should start with the correct selection', function(){
					expect(sel.getRangeAt(0).toHtml()).toBe('sed do eiusmod tempor incididunt');
				});
				
				it('should set _actionRunning to true', function(){
					editorScope.startAction();
					expect(editorScope._actionRunning);
				});
				
				it('should return a function that resets the selection', function(){
					var resetFunc = editorScope.startAction();
					expect(sel.toHtml()).toBe('sed do eiusmod tempor incididunt');
					// change selection
					var range = window.rangy.createRangyRange();
					range.selectNodeContents(element.find('.ta-text p i')[0]);
					sel.setSingleRange(range);
					sel.refresh();
					expect(sel.toHtml()).toBe('consectetur adipisicing');
					// reset selection
					resetFunc();
					sel.refresh();
					expect(sel.toHtml()).toBe('sed do eiusmod tempor incididunt');
				});
			});
			
			describe('endAction should remove the ability to restore selection', function(){
				it('shouldn\'t affect the selection', function(){
					editorScope.startAction();
					editorScope.endAction();
					expect(sel.toHtml()).toBe('sed do eiusmod tempor incididunt');
				});
				
				it('shouldn\'t restore the selection', function(){
					var resetFunc = editorScope.startAction();
					editorScope.endAction();
					var range = window.rangy.createRangyRange();
					range.selectNodeContents(element.find('.ta-text p i')[0]);
					sel.setSingleRange(range);
					sel.refresh();
					expect(sel.toHtml()).toBe('consectetur adipisicing');
					// reset selection - should do nothing now
					resetFunc();
					sel.refresh();
					expect(sel.toHtml()).toBe('consectetur adipisicing');
				});
			});
		});
		
		describe('should work without rangy loaded', function(){
			var _rangy;
			beforeEach(function(){
				// used for testing
				_rangy = window.rangy;
				window.rangy = undefined;
			});
			afterEach(function(){
				window.rangy = _rangy;
			});
			beforeEach(module('textAngular'));
			
			it('should NOT have rangy loaded with save-restore module', function(){
				expect(window.rangy).not.toBeDefined();
			});
			
			var editorScope, element;
			beforeEach(inject(function($compile, $rootScope, textAngularManager, $document){
				$rootScope.htmlcontent = '<p>Lorem ipsum dolor sit amet, <i>consectetur adipisicing</i> elit, <strong>sed do eiusmod tempor incididunt</strong> ut labore et dolore magna aliqua.</p>';
				element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents2</text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				editorScope = textAngularManager.retrieveEditor('test').scope;
				// setup selection
				var sel = _rangy.getSelection();
				var range = _rangy.createRangyRange();
				range.selectNodeContents(element.find('.ta-text p strong')[0]);
				sel.setSingleRange(range);
			}));
			
			it('should set the variables correctly and NOT error', function(){
				var resultFunc;
				expect(function(){
					resultFunc = editorScope.startAction();
				}).not.toThrow();
				expect(resultFunc).not.toBeDefined();
				expect(editorScope._actionRunning);
				expect(function(){
					editorScope.endAction();
				}).not.toThrow();
			});
		});
	});
	
	describe('Toolbar interaction functions work', function(){
		beforeEach(module('textAngular'));
		var editorScope, element, sel, range;
		beforeEach(inject(function(taRegisterTool, taOptions){
			taRegisterTool('testbutton', {
				buttontext: 'reactive action',
				action: function(){
					return this.$element.attr('hit-this', 'true');
				},
				commandKeyCode: 21,
				activeState: function(){ return true; },
				onElementSelect: {
					element: 'a',
					action: function(event, element, editorScope){
						element.attr('hit-via-select', 'true');
						this.$element.attr('hit-via-select', 'true');
					}
				}
			});
			taOptions.toolbar = [
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'testbutton'],
				['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
				['justifyLeft','justifyCenter','justifyRight'],
				['html', 'insertImage', 'insertLink', 'unlink']
			];
		}));
		beforeEach(inject(function($compile, $rootScope, textAngularManager, $document){
			$rootScope.htmlcontent = '<p>Lorem ipsum <u>dolor sit amet<u>, consectetur <i>adipisicing elit, sed do eiusmod tempor incididunt</i> ut labore et <a>dolore</a> magna aliqua.</p>';
			element = $compile('<text-angular name="test" ng-model="htmlcontent">Test Contents2</text-angular>')($rootScope);
			$document.find('body').append(element);
			editorScope = textAngularManager.retrieveEditor('test').scope;
			textAngularManager.retrieveEditor('test').editorFunctions.focus();
			$rootScope.$digest();
			// setup selection
			sel = window.rangy.getSelection();
			range = window.rangy.createRangyRange();
			range.selectNodeContents(element.find('.ta-text p i')[0]);
			sel.setSingleRange(range);
		}));
		afterEach(function(){
			element.remove();
		});
		
		it('should not trigger focus out while an action is processing', inject(function($timeout){
			element.find('.ta-text').triggerHandler('focus');
			editorScope.$parent.$digest();
			editorScope.startAction();
			element.find('.ta-text').triggerHandler('blur');
			editorScope.$parent.$digest();
			$timeout.flush();
			expect(element.find('button:disabled').length).toBe(0);
		}));
		
		it('keypress should call sendKeyCommand', function(){
			element.find('.ta-text').trigger({type: 'keypress', metaKey: true, which: 21});
			editorScope.$parent.$digest();
			expect(element.find('.ta-toolbar button[name=testbutton]').attr('hit-this')).toBe('true');
		});
		
		describe('wrapSelection', function(){
			it('should wrap the selected text in tags', function(){
				editorScope.wrapSelection('bold');
				expect(element.find('.ta-text p b').length).toBe(1);
			});
			
			it('should unwrap the selected text in tags on re-call', function(){
				editorScope.wrapSelection('bold');
				editorScope.wrapSelection('bold');
				expect(element.find('.ta-text p b').length).toBe(0);
			});
		});
		
		describe('queryFormatBlockState', function(){
			it('should return true if formatted', function(){
				editorScope.wrapSelection("formatBlock", "<PRE>");
				expect(editorScope.queryFormatBlockState('PRE'));
			});
			it('should return false if un-formatted', function(){
				editorScope.wrapSelection("formatBlock", "<PRE>");
				expect(editorScope.queryFormatBlockState('p'));
			});
		});
		
		describe('ta-element-select event', function(){
			it('fires correctly on element selector', function(){
				var triggerElement = element.find('.ta-text a');
				triggerElement.triggerHandler('click');
				expect(triggerElement.attr('hit-via-select')).toBe('true');
			});
			
			it('fires correctly when filter returns true', inject(function(taTools){
				taTools.testbutton.onElementSelect.filter = function(){ return true; };
				var triggerElement = element.find('.ta-text a');
				triggerElement.triggerHandler('click');
				expect(triggerElement.attr('hit-via-select')).toBe('true');
			}));
			
			it('does not fire when filter returns false', inject(function(taTools){
				taTools.testbutton.onElementSelect.filter = function(){ return false; };
				var triggerElement = element.find('.ta-text a');
				triggerElement.triggerHandler('click');
				expect(triggerElement.attr('hit-via-select')).toBeUndefined();
			}));
		});
		
		describe('popover', function(){
			it('should show the popover', function(){
				editorScope.showPopover(element.find('.ta-text p i'));
				expect(editorScope.displayElements.popover.hasClass('in')).toBe(true);
			});
			describe('should hide the popover', function(){
				beforeEach(inject(function($timeout){
					editorScope.showPopover(element.find('.ta-text p i'));
					$timeout.flush();
					editorScope.$parent.$digest();
				}));
				it('on function call', function(){
					editorScope.hidePopover();
					expect(editorScope.displayElements.popover.hasClass('in')).toBe(false);
				});
				it('on click in editor', function(){
					editorScope.displayElements.html.parent().triggerHandler('click');
					editorScope.$parent.$digest();
					expect(editorScope.displayElements.popover.hasClass('in')).toBe(false);
				});
				it('should prevent mousedown from propagating up from popover', function(){
					var test = false;
					editorScope.displayElements.popover.on('mousedown', function(e){
						test = e.isDefaultPrevented();
					});
					editorScope.displayElements.popover.triggerHandler('mousedown');
					editorScope.$parent.$digest();
					expect(test).toBe(true);
				});
			});
		});
		
		describe('updating styles', function(){
			var iButton;
			beforeEach(function(){
				//find italics button
				iButton = element.find('button[name=italics]');
			});
			
			it('should be initially active when selected', function(){
				expect(iButton.hasClass('active'));
			});
			
			it('should change on keypress', function(){
				range.selectNodeContents(element.find('.ta-text p u')[0]);
				sel.setSingleRange(range);
				element.find('.ta-text').triggerHandler('keypress');
				expect(!iButton.hasClass('active'));
			});
			
			it('should change on keydown and stop on keyup', inject(function($timeout){
				element.find('.ta-text').triggerHandler('keydown');
				range.selectNodeContents(element.find('.ta-text p u')[0]);
				sel.setSingleRange(range);
				setTimeout(function(){
					expect(!iButton.hasClass('active'));
					setTimeout(function(){
						range = window.rangy.createRangyRange();
						range.selectNodeContents(element.find('.ta-text p i')[0]);
						setTimeout(function(){
							expect(iButton.hasClass('active'));
							element.find('.ta-text').triggerHandler('keydown');
							setTimeout(function(){
								range.selectNodeContents(element.find('.ta-text p u')[0]);
								setTimeout(function(){
									expect(iButton.hasClass('active'));
								}, 201);
							}, 201);
						}, 201);
					}, 201);
				}, 201);
			}));
			
			it('should change on mouseup', function(){
				range.selectNodeContents(element.find('.ta-text p u')[0]);
				sel.setSingleRange(range);
				element.find('.ta-text').triggerHandler('mouseup');
				expect(!iButton.hasClass('active'));
			});
		});
	});
	
	describe('File Drop Event', function(){
		beforeEach(module('textAngular'));
		afterEach(inject(function($timeout){
			try{
				$timeout.flush();
			}catch(e){}
		}));
		
		it('should respect the function set in the attribute', inject(function($compile, $rootScope){
			$rootScope.htmlcontent = '';
			var testvar = false;
			$rootScope.testhandler = function(){
				testvar = true;
			};
			element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
			element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
			$rootScope.$digest();
			expect(testvar).toBe(true);
		}));
		
		it('when no attribute should use the default handler in taOptions', inject(function($compile, $rootScope, taOptions){
			$rootScope.htmlcontent = '';
			var testvar = false;
			taOptions.defaultFileDropHandler = function(){
				testvar = true;
			};
			element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
			$rootScope.$digest();
			expect(testvar).toBe(true);
		}));
		
		it('handler not fired when no files and no errors', inject(function($compile, $rootScope, taOptions){
			$rootScope.htmlcontent = '';
			var testvar = false;
			taOptions.defaultFileDropHandler = function(){
				testvar = true;
			};
			element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
			element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: [], types: ['url or something']}}});
			$rootScope.$digest();
			expect(testvar).toBe(false);
			expect(function(){
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {}}});
			}).not.toThrow();
			expect(function(){
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {}});
			}).not.toThrow();
		}));
		
		describe('check handler return values respected', function(){
			it('default inserts returned html', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				taOptions.defaultFileDropHandler = function(file, insertAction){
					insertAction('<img/>');
					return true;
				};
				element = $compile('<text-angular name="test" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><img><br></p>');
				element.remove();
			}));
			it('attr function inserts returned html', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				$rootScope.testhandler = function(file, insertAction){
					insertAction('<img/>');
					return true;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><img><br></p>');
				element.remove();
			}));
			it('attr function overrides default', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				taOptions.defaultFileDropHandler = function(file, insertAction){
					insertAction('<wrong/>');
					return true;
				};
				$rootScope.testhandler = function(file, insertAction){
					insertAction('<img/>');
					return true;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><img><br></p>');
				element.remove();
			}));
			it('default inserted if attr function returns false', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				taOptions.defaultFileDropHandler = function(file, insertAction){
					insertAction('<img/>');
					return true;
				};
				$rootScope.testhandler = function(file, insertAction){
					return false;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><img><br></p>');
				element.remove();
			}));
		});
		
		describe('test insertAction error catching in place', function(){
			it('insert string', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				$rootScope.testhandler = function(file, insertAction){
					insertAction('<img/>');
					return true;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><img><br></p>');
				element.remove();
			}));
			it('pass nothing', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				$rootScope.testhandler = function(file, insertAction){
					insertAction();
					return true;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><br></p>');
				element.remove();
			}));
			it('pass empty string does nothing', inject(function($compile, $rootScope, taOptions, $document){
				$rootScope.htmlcontent = '';
				$rootScope.testhandler = function(file, insertAction){
					insertAction('');
					return true;
				};
				element = $compile('<text-angular name="test" ta-file-drop="testhandler" ng-model="htmlcontent"></text-angular>')($rootScope);
				$document.find('body').append(element);
				$rootScope.$digest();
				element.find('.ta-text').triggerHandler({type: 'drop', originalEvent: {dataTransfer: {files: ['test'], types: ['files']}}});
				$rootScope.$digest();
				expect(element.find('.ta-text').html()).toBe('<p><br></p>');
				element.remove();
			}));
		});
		
		/*
				scope.displayElements.text[0].focus();
						if(dropEvent.originalEvent.dataTransfer && dropEvent.originalEvent.dataTransfer.files && dropEvent.originalEvent.dataTransfer.files.length > 0){
							This function not tested
							var insertAction = function(html){
								// if angular object passed back
								if(html && angular.isElement(html)) html = angular.element(html)[0].outerHtml;
								if(html && html !== '') scope.wrapSelection('insertHTML', html);
							};
							angular.forEach(dropEvent.originalEvent.dataTransfer.files, function(file, index){
								// taking advantage of boolean execution, if the fileDropHandler returns true, nothing else after it is executed
								// If it is false then execute the defaultFileDropHandler if the fileDropHandler is NOT the default one
								try{
						--->			return scope.fileDropHandler(dropEvent.originalEvent.dataTransfer.types[index], file, insertAction) ||
						--->				(scope.fileDropHandler !== scope.defaultFileDropHandler &&
						--->				scope.defaultFileDropHandler(dropEvent.originalEvent.dataTransfer.types[index], file, insertAction));
								}catch(error){}
							});
							dropEvent.preventDefault();
							dropEvent.stopPropagation();
						}
					});
		*/
	});
	
	describe('Multiple Editors same toolbar', function(){
		beforeEach(module('textAngular'));
		// For more info on this see the excellent writeup @ https://github.com/fraywing/textAngular/issues/112
		var element1, element2, toolbar, $rootScope;
		beforeEach(inject(function($compile, _$rootScope_){
			$rootScope = _$rootScope_;
			$rootScope.htmlcontent = '<p>Lorem ipsum <u>dolor sit amet<u>, consectetur <i>adipisicing elit, sed do eiusmod tempor incididunt</i> ut labore et dolore magna aliqua.</p>';
			toolbar = $compile('<text-angular-toolbar name="toolbar"></text-angular-toolbar>')($rootScope);
			element1 = $compile('<text-angular name="test1" ng-model="htmlcontent" ta-target-toolbars="toolbar"></text-angular>')($rootScope);
			element2 = $compile('<text-angular name="test2" ng-model="htmlcontent" ta-target-toolbars="toolbar"></text-angular>')($rootScope);
			$rootScope.$digest();
		}));
		
		it('should re-focus on toolbar when swapping directly from editor to editor', inject(function($timeout){
			element1.find('.ta-text').triggerHandler('focus');
			$rootScope.$digest();
			expect(toolbar.find('button:not(:disabled)').length).toBe(25);
			element2.find('.ta-text').triggerHandler('focus');
			$rootScope.$digest();
			$timeout.flush();
			// expect none to be disabled
			expect(toolbar.find('button:not(:disabled)').length).toBe(25);
		}));
	});
});