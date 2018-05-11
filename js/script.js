function catClick() {

    var $body = $('body');    
    var points = 0;

    
    $(document).ready(function(){

        console.log("loaded");
        var $catPointElem = $('#cat_points');
        var catImageElem = document.getElementById('cat_image');
        $catPointElem.text("Your Point: "+ points);

        catImageElem.addEventListener('click',function(){
      		//the element has been clicked... do stuff here
      		points = points + 1;
            console.log("clicked");
        	$catPointElem.text("Your Point: "+ points);
	   });
    });
};

catClick();