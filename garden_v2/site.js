var Site = {
	
	start: function(){
		
		Site.appearText();
		
		if ($('kwick')) Site.parseKwicks();
		
		if ($('download')) Download.start();
	},
	
	parseKwicks: function(){
		var kwicks = $$('#kwick .kwick');
		var fx = new Fx.Elements(kwicks, {wait: false, duration: 200, transition: Fx.Transitions.quadOut});
		kwicks.each(function(kwick, i){
			kwick.addEvent('mouseover', function(e){
				e = new Event(e).stop();
				var obj = {};
				obj[i] = {
					'width': [kwick.getStyle('width').toInt(), 185]
				};
				kwicks.each(function(other, j){
					if (other != kwick){
						var w = other.getStyle('width').toInt();
						if (w != 105) obj[j] = {'width': [w, 105]};
					}
				});
				fx.start(obj);
			});
		});
		
		document.addEvent('mouseover', function(e){
			e = new Event(e);
			var rel = e.relatedTarget;
			if (!rel) return;
			if (rel.hasClass && (rel.hasClass('kwicks') || rel.hasClass('kwick') || rel.id == 'kwick')){
				var obj = {};
				kwicks.each(function(other, j){
					obj[j] = {'width': [other.getStyle('width').toInt(), 125]};
				});
				fx.start(obj);
			};
		});
	},
	
	appearText: function(){
		var timer = 0;
		var sideblocks = $$('#sidebar li');
		
		var slidefxs = [];
		var colorfxs = [];
		
		sideblocks.each(function(el, i){
			el.setStyle('margin-left', '-155px');
			timer += 150;
			slidefxs[i] = new Fx.Style(el, 'margin-left', {
				duration: 400,
				transition: Fx.Transitions.backOut,
				wait: false,
				onComplete: Site.createOver.pass([el, i])
			});
			slidefxs[i].start.delay(timer, slidefxs[i], 0);

		}, this);
	},
	
	createOver: function(el, i){
		var first = el.getFirst();
		if (!first || first.getTag() != 'a') return;
		var overfxs = new Fx.Styles(first, {'duration': 200, 'wait': false});
		if (first.hasClass('big')){
			var tocolor = '333';
			var fromcolor = 'fff';
		} else {
			var tocolor = 'faec8f';
			var fromcolor = '666';
		}
		el.addEvent('mouseover', function(){
			overfxs.start({
				'color': tocolor,
				'margin-left': 10
			});
		});
		el.addEvent('mouseout', function(){
			overfxs.start({
				'color': fromcolor,
				'margin-left': 0
			});
		});
	}
	
};

var Download = {

	start: function(){
		Download.checkAll = $('checkall');
		Download.checkNone = $('checknone');
		Download.checkAll.addEvent('click', function(event){
			new Event(event).stop();
			Download.all();
		});
		Download.checkNone.addEvent('click', function(event){
			new Event(event).stop();
			Download.none();
		});
		Download.trs = $$('tr.option');
		Download.chks = $$('#download div.check');
		Download.radios = $$('#options div.check');
		Download.fx = [];
		Download.parse();
		
		Download.select(Download.chks[0]);
		
		Download.chks.each(function(chk){
			if (chk.getElement('input').checked) Download.select(chk);
		});
		
		Download.select(Download.radios[0]);
		
		[].extend(Download.chks).extend(Download.radios).each(function(chk){
			chk.getElement('input').setStyle('display', 'none');
		});
	},

	select: function(chk){
		chk.getElement('input').checked = 'checked';
		Download.fx[chk.index].start({
			'background-color': '#191919',
			'color': '#FFF'
		});
		chk.addClass('selected');
		
		if (chk.deps){
			chk.deps.each(function(id){
				if (!$(id).hasClass('selected')) Download.select($(id));
			});
		} else {
			Download.radios.each(function(other){
				if (other == chk) return;
				Download.deselect(other);
			});
		}
	},
	
	all: function(){
		Download.chks.each(function(chk){
			Download.select(chk);
		});
	},
	
	none: function(){
		Download.chks.each(function(chk){
			Download.deselect(chk);
		});
	},

	deselect: function(chk){
		chk.getElement('input').checked = false;
		Download.fx[chk.index].start({
			'background-color': '#202020',
			'color': '#555'
		});
		chk.removeClass('selected');
		
		if (chk.deps){
			Download.chks.each(function(other){
				if (other == chk) return;
				if (other.deps.test(chk.id) && other.hasClass('selected')) Download.deselect(other);
			});
		}
	},

	parse: function(){
		Download.trs.each(function(tr, i){
			Download.fx[i] = new Fx.Styles(tr, {wait: false, duration: 300});

			var chk = tr.getElement('div.check');

			chk.index = i;
			var dp = chk.getProperty('deps');
			if (dp) chk.deps = dp.split(',');

			tr.onclick = function(){
				if (!chk.hasClass('selected')) Download.select(chk);
				else if (tr.hasClass('file')) Download.deselect(chk);
			};

			tr.onmouseover = function(){
				if (!chk.hasClass('selected')){
					Download.fx[i].start({
						'background-color': '#1c1c1c',
						'color': '#bbb'
					});
				}
			}

			tr.onmouseout = function(){
				if (!chk.hasClass('selected')){
					Download.fx[i].start({
						'background-color': '#202020',
						'color': '#666'
					});
				}
			}

		});
	}

};

window.addEvent('domready', Site.start);