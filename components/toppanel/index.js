var toppanel = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el, links = {

			index : "index",

			sub : "index?r=sub",

			recommended : 	"index?r=recommended"

		};

		var actions = {
			selector : function(){

				var vs = _.toArray(links)

				var r = parameters(self.app.nav.current.completeHref, true).r || 'index'

				var contents = new Parameter({
					type : "VALUES",
					name : "Contents",
					id : 'contents',
					possibleValues : vs, 
					possibleValuesLabels : [self.app.localization.e('e13136'), self.app.localization.e('e13137'), self.app.localization.e('e13138')],
					defaultValue : links[r]
				
				})

				contents.value = links[r]

				contents._onChange = function(v){

					var href = v;

					self.nav.api.load({
						open : true,
						href : href,
						history : true,
						
					})
					
				}

				return contents;

			}
		}

		var events = {
			
		}

		var renders = {
			menu : function(pathname){

				var selector = actions.selector()

				self.app.user.isState(function(state){

					if(state && isMobile() && pathname != 'index'){
						el.c.addClass('hidden')
					}
					else{

						el.c.removeClass('hidden')
						self.shell({

							name :  'menu',
							el :   el.menu,
							data : {
								pathname : pathname,
								state : state,
								mobile : isTablet(),
	
								selector : selector
							},
	
						}, function(_p){
	
							ParametersLive([selector], _p.el)
	
						})
					}

					
				})

				
			}
		}

		var state = {
			save : function(){

			},
			load : function(){
				
			}
		}

		var initEvents = function(){

			self.app.nav.clbks.history.toppanel = function(href){

				renders.menu(app.nav.current.href)

			}

		}

		return {
			primary : primary,

			getdata : function(clbk){

				var data = {};

				clbk(data);

			},

			destroy : function(){
				delete self.app.nav.clbks.history.toppanel
				
				el = {};
			},
			
			init : function(p){

				state.load();

				el = {};
				el.c = p.el.find('#' + self.map.id);

				el.menu = el.c.find('.panelitems')

				initEvents();

				renders.menu(self.app.nav.current.href)

				p.clbk(null, p);
			}
		}
	};



	self.run = function(p){

		var essense = self.addEssense(essenses, Essense, p);

		self.init(essense, p);

	};

	self.stop = function(){

		_.each(essenses, function(essense){

			essense.destroy();

		})

	}

	return self;
})();


if(typeof module != "undefined")
{
	module.exports = toppanel;
}
else{

	app.modules.toppanel = {};
	app.modules.toppanel.module = toppanel;

}