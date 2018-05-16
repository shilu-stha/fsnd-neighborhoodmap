var cats = [
    {id:1, name:"Hissi", picture:"css/hissi_biralu.jpg", point:0},
    {id:2, name:"Lajalu", picture:"css/lajalu_biralu.jpg", point:0},
    {id:3, name:"Alchi", picture:"css/alchi_biralu.jpg", point:0},
    {id:4, name:"Chakkapareko", picture:"css/chakkapareko_biralu.jpg", point:0},
    {id:5, name:"Motee", picture:"css/motee_biralu.jpg", point:0},
    {id:6, name:"Sutuwa", picture:"css/sutuwa_biralu.jpg", point:0}
];


function catClick() {

    $(document).ready(function(){

        var $body = $('body');   
        var $catListContainerElem = $('#cat_list_container'); 
        var $catListElem = $('#cats_list');
        
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            $catListElem.append('<li class="cat_item">'+
                '<p>' + cat.name + '</p>'+
                '<img class="list_item" id="cat_'+ cat.id +
                '" src="'+ cat.picture +'">'+
                '</li>');

            var catItem = document.getElementById('cat_'+cat.id);

            catItem.addEventListener('click',(function(catCopy){
                    return function() {
                        updateSelectedContainer(catCopy);
                };
            })(cat));
        };
        updateSelectedContainer(cats[0]);
    });
};

function updateSelectedContainer(selectedItem) {
   
    $(document).ready(function(){
         
        var catNameElem = document.getElementById('selected_item_header');    
        var catPointElem = document.getElementById('selected_item_point');
        var catImageElem = document.getElementById('selected_item');
        
        catNameElem.innerText = selectedItem.name;
        catImageElem.src = selectedItem.picture;
        catPointElem.innerText = "Points: "+selectedItem.point;

        catImageElem.addEventListener('click',function(){
            //the element has been clicked... do stuff here
            selectedItem.point = selectedItem.point + 1;
            catPointElem.innerText = "Points: "+ selectedItem.point;
        });
    });
};

catClick();