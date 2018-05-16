var model = {

	currentCat: null,

	cats: [
	    {id:1, name:"Hissi", imageSource:"css/hissi_biralu.jpg", clickCount:0},
	    {id:2, name:"Lajalu", imageSource:"css/lajalu_biralu.jpg", clickCount:0},
	    {id:3, name:"Alchi", imageSource:"css/alchi_biralu.jpg", clickCount:0},
	    {id:4, name:"Chakkapareko", imageSource:"css/chakkapareko_biralu.jpg", clickCount:0},
	    {id:5, name:"Motee", imageSource:"css/motee_biralu.jpg", clickCount:0},
	    {id:6, name:"Sutuwa", imageSource:"css/sutuwa_biralu.jpg", clickCount:0}
	]
};

var octopus = {

	getAllCats: function(){
		return model.cats;
	},

	getCurrentCat: function(catID) {
		return model.currentCat;
	},

	setCurrentCat: function(cat) {
		model.currentCat = cat;
	},

	incrementClickCount: function(){
		model.currentCat.clickCount ++;
		catView.render();
	},

	init: function() {
		model.currentCat = model.cats[0];

		catListView.init();
		catView.init();
	}

};

var catView = {

	init: function() {
		$(document).ready(function(){
			this.catNameElem = document.getElementById('current_item_header');    
	        this.catclickCountElem = document.getElementById('current_item_clickCount');
	        this.catImageElem = document.getElementById('current_item');
	       
	       	catImageElem.addEventListener('click',function(){
	            octopus.incrementClickCount();
	        });
       	});

        this.render();
	},

	render: function() {
		var currentCat = octopus.getCurrentCat();

		this.catNameElem.textContent = currentCat.name;
    	this.catImageElem.src = currentCat.imageSource;
    	this.catclickCountElem.textContent = "ClickCounts: "+currentCat.clickCount;
	}

};

var catListView = {

	init: function() {
		this.catListElem = document.getElementById('cat_list');
		
		this.render();
	},

	render: function() {
		var catList = octopus.getAllCats();

		for (var i = 0; i < catList.length; i++) {
        	var cat = catList[i];

        	var listElem = document.createElement('li');
        	listElem.class = 'cat_item';
        	listElem.textContent = cat.name;

        	var imgElement = document.createElement('img');
        	imgElement.src = cat.imageSource;
        	imgElement.class = 'img_item';
        	// imgElement.id = 'cat_'+cat.id;

        	listElem.appendChild(imgElement);

        	// var catItem = document.getElementById('cat_'+cat.id);

        	listElem.addEventListener('click',(function(cat){
                return function() {
                    octopus.setCurrentCat(cat);
                    catView.render();
            	};
        	})(cat));

        	this.catListElem.appendChild(listElem);
    	};
	}
};

octopus.init();