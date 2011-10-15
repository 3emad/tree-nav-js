// TODO: Operatione on page change should be method call name
// TODO: Optional Callback validation on each step
// FIXME: excecptions throws undefined object
var navigationPath = {
	step_class: null, // reqiured and UNQIUE
	nav_id: null,
	fail: false,
	//page: 0, // start
	furthest_clicked_page: 0,
	menuLength: 0,
	inst: [],
	clickObj: {},
	callback_nav_condition: function(){ if(this.fail){this.fail = false; /* reset */ return false;}else{return true;} },
	callback_pagemove_success: undefined,
	callback_nav_next: undefined,
	callback_nav_prev: undefined,
	callback_nav_page: undefined,
	
	// XXX HACKING IT
	load: function(objectStepClasses,page){
		var $this = this;
		$.each(objectStepClasses, function(key, val){
			var obj = $this.init(key,key,val.id);
			if(val.page){
				message_show = false; // dont show messages
				for(var i = 0; i < val.page; i++){
					objInstExceptions(obj);
					if(i == 1){
						$('#create-ad-setup ul.options-list li[rel="image-order-set"]').trigger('click');
						$('a.next-create-ad-toggle-menu:visible').trigger('click');

					}else{
						$('.nav a.next-step-menu-navigation:visible').trigger('click');
					}
				}
				message_show = true; // toggle back showing messages
			}
		});
	},
	
	init: function(clickedObj,step_class, nav_id, page_no){
		if(typeof clickedObj == 'string'){
			step_class = clickedObj; // call the instance or define one manually
		}else
		if(typeof step_class == 'undefined'){
			var classString = $(clickedObj).attr('class');
			if(!classString)
				throw{
					name: 		'ErrType',
					message:	'`clickedObj` not a navigation menu'
				};
			var matchedProperties = classString.match(/(next|prev)-[a-z|-]+/i);
			if(matchedProperties < 2)
				throw{
					name: 		'ErrType',
					message:	'Incorrect class name'
				};
			
			// HACK: class names have "-"
			// prev-create-ad-toggle-menu-navigation
			matchedProperties = matchedProperties[0].split('-menu'); //chunk of menu with option nav_id
			// Navigation ID
			nav_id = matchedProperties[1].substring(1) || undefined; // remove the '-' at the beginning
			
			// step_class
			matchedProperties = matchedProperties[0].split('-');
			matchedProperties.splice(0,1); // chop off the 1st index
			if(matchedProperties.length > 1)
				step_class = matchedProperties.join('-');
			else
				step_class = matchedProperties[0];
		}
		
		if(typeof this.inst[step_class] == 'undefined'){ // singleton pattern
			this.inst[step_class] = Object.create(navigationPath); // factory pattern
			this.inst[step_class].nav_id = nav_id;
			this.inst[step_class].step_class = step_class;
			this.inst[step_class].page = page_no || 0; // start
			this.inst[step_class].menuLength = $('.'+step_class).length;
			this.inst[step_class].clickedObj = clickedObj;
			return this.inst[step_class];
		}else{
			return this.inst[step_class];
		}
	},
	next: function(clickedObj, step_class, nav_id){ // that Clicked element obj
		this.checkInit(clickedObj, step_class, nav_id);
		this.pageChange('next');
	},
	prev: function(clickedObj, step_class, nav_id){ // that Clicked element obj
		this.checkInit(clickedObj, step_class, nav_id);
		this.pageChange('prev');
	},
	
	pageChange: function(op){ // page = int, op = string
		
		var $stepClass = '.'+this.step_class;
		if(typeof this.nav_id != 'undefined')
			var $navId = '#'+this.nav_id; // its to jump between pages through clicking
		if(this.callback_nav_condition(this.clickedObj,$stepClass,$navId)){ //conditional callback function
			
			if(this.page <= this.menuLength){
				if(this.page == this.menuLength){
					this.furthest_clicked_page = this.page;
				}else
				if(typeof op == 'string' ){
					if(op == 'next')
						this.page++;
					else
						this.page--;
					// current page state is used for previous clicked menus which are enabled now
					this.furthest_clicked_page = this.page;
				}else
				if(typeof op == 'number'){
					var page = this.page; // the page clicked before
					this.page = op; // switch page number
					if(typeof this.callback_nav_page != 'undefined')
						this.callback_nav_page(elm,page);
				}
				
				if(typeof this.callback_pagemove_success != 'undefined')
					this.callback_pagemove_success();

				$($stepClass).hide();
				$($stepClass+':eq('+(this.page)+')').show();
				console.log($stepClass+':eq('+(this.page)+')');
				
				// TODO: not hooked to a navigation, XXX use the stepclass instead of navId for instances since steps are mandotory
				if(typeof $navId == 'undefined'){ 
					return true;
				}
				
				var elm = $($navId+' li:nth-child('+(this.page)+')');
				if(op == 'next'){
					if(typeof this.callback_nav_next != 'undefined')
						this.callback_nav_next(elm);
				}else if(op == 'prev'){	// applies to change to page
					if(typeof this.callback_nav_prev != 'undefined')
						this.callback_nav_prev(elm);
				}
				
				return true;
			}
		}
	},
	
	checkInit: function(){
		if(typeof this.step_class == 'undefined'){ // check property if defined 
			if(typeof arguments[1] == 'undefined') // this should be defined unqily
				throw({
					type: 'ErrType',
					message: '`step_class` should be defined'
				});
			var instObj = this.init(arguments[0],arguments[1],arguments[2]);
		}
	}
};