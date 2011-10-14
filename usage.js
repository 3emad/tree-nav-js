// 1st load
var objInst = null;
if(typeof page != 'undefined' && page != 0){
	var obj = {'step': { 
							id: 'navigation', 
							page: page
						},
				'ad-builder-step':
						{
							id:'sub-navigation'
						}
				};
	navigationPath.load(obj);
}


$('#navigation a,#sub-navigation a').bind('click',function(event){
	var index = null;
	var objInst = null;
	debug($(this).parents('ul#sub-navigation').length);
	if($(this).parents('ul#sub-navigation').length){ // if it has anyting then its a sub navigation
		objInst = navigationPath.init('ad-builer-step');//('create-ad-toggle');
		index = $('#sub-navigation a').index(this);
	}else{
		objInst = navigationPath.init('step');//('create-ad-toggle');
		index = $('#navigation a').index(this);
	}
	
	if(index > objInst.furthest_clicked_page){
		event.stopPropagation();
	}else{
		// TODO objInst use changePage with sending in which page should it go to
		if(typeof callback_validate[objInst.step_class][objInst.page] == 'undefined' || callback_validate[objInst.step_class][objInst.page].call(this,operation,event,objInst))
			objInst.pageChange(index);
	}
	// event.stopPropagation(); This is not fixing it 
	return false;
});


$('.next-create-ad-toggle-menu, .nav a.next-step-menu-navigation, .sub-nav a.next-navigation-step, a.next-ad-builer-step-menu-sub-navigation').bind('click',function(event){
	objInst = navigationPath.init(this); // inst[1] is the step class
	objInstExceptions(objInst);
	operation = 'next';
	// if the method doesnt exists, it means no validation, if there is, it will depend on the callback then 
	if(typeof callback_validate[objInst.step_class][objInst.page] == 'undefined' || callback_validate[objInst.step_class][objInst.page].call(this,operation,event,objInst)){
		objInst.next();
	}
});

$('.nav a.prev-step-menu-navigation,.prev-create-ad-toggle-menu,.sub-nav a.prev-navigation-step,a.prev-ad-builer-step-menu-sub-navigation').bind('click',function(event){
	var objInst = navigationPath.init(this); // inst[1] is the step class
	operation = 'prev';
	// if the method doesnt exists, it means no validation, if there is, it will depend on the callback then 
	//if(typeof callback_validate[objInst.step_class][objInst.page-1] == 'undefined' || callback_validate[objInst.step_class][objInst.page-1].call(this,operation,event,objInst)){ // since its previous
		objInst.prev();
		current_page = objInst.page;	// page navigation
	//}
});

function objInstExceptions(objInst){
	// EXCEPTION CONIDTION
	// Styling for main Navigation	
	if((objInst.step_class == 'step' || objInst.step_class == 'ad-builer-step')  && typeof objInst.callback_nav_next == 'undefined'){ // init only once
		
		objInst.callback_nav_next = function(elm){ // navigation element
			elm.addClass('light-grey  stepdone').removeClass('cyan dark-grey').find('.circle').html('&#10004;');
			elm.children('a').css('cursor','pointer');
			elm.next().addClass('cyan').children('a').css('cursor','pointer');
			ad_preview_toggle(this);
		};
		
		objInst.callback_nav_prev = function(elm){ // navigation element
			elm = elm.next(); // its ahead i dunno why
			if(!(elm.next().removeClass('cyan').length > 0)){ // for previous 1st child
				$('#'+this.nav_id+' li:first-child').addClass('cyan').next().removeClass('cyan');
			}
			elm.addClass('cyan');
			ad_preview_toggle(this);
		};
		
	}
	
	if(objInst.step_class == 'step' || objInst.step_class == 'ad-builer-step' && typeof objInst.callback_nav_page == 'undefined'){
		objInst.callback_nav_page = function(elm,page){
			$('#'+this.nav_id+' li:eq('+page+')').removeClass('cyan');
			$('#'+this.nav_id+' li:eq('+this.page+')').addClass('cyan');
			ad_preview_toggle(this);
		};
	}
	
	// EXCEPTION CONIDTION
	// login modal for previous ads
	if(objInst.step_class == 'create-ad-toggle'){ // On menu navigation of choices, There is condition
		window.choice = $('#create-ad-setup .options-list li input:checked').parents('li').attr('rel');
		objInst.callback_nav_condition = function(clickedObj,class_step_nav, nav_id){
			if(this.page == 0 && !window.user_id && window.choice == 'previous'){
				$("#login-form").modal({overlayClose:true,close: true,autoResize: true});
				window.callback_login = function(){
					if(window.user_id){
						//gotopage(page_no, nav_id, class_step_nav);
						$('#create-ad-setup .button').trigger('click');
						get_order_list(); // get orders list which is the same ad sizes and for the same users and different zones
						$.modal.close();
					}
				};
				//get_order_list();
				return false;
			}
			
			
			return true;
		};
		
		objInst.callback_nav_prev = function(elm){ 
			if(this.page == 1 && typeof order_image_url != 'undefined'){
				
			}
		};
	}
}



// Validations
if(typeof callback_validate == 'undefined'){
	var callback_validate = [];
}

if(typeof callback_validate['step'] == 'undefined')
	callback_validate['step'] = {};

if(typeof callback_validate['step'][0] == 'undefined')
	callback_validate['step'][0] = function(operation,event,objInst){
		//alert('Emad, I can see you.');
		return true;
	};
	
if(typeof callback_validate['step'][1] == 'undefined')	
	callback_validate['step'][1] = function(operation,event,objInst){
		return true;
	};

callback_validate['create-ad-toggle'] = {};

callback_validate['ad-builer-step'] = {
	0: function(operation,event,objInst){
		//alert('1st page');
		return true;
	},
	1: function(operation,event,objInst){
		//alert('2nd page');
		return true;
	}, 
	2: function(operation,event,objInst){
		//alert('3rd page');
		return true;
	}
};